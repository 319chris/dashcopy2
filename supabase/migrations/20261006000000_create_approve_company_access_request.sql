-- 平台管理员批准一条公司接入申请。
-- 整个函数在一个数据库事务中运行：任何一步失败，所有写入都会回滚。

create or replace function public.approve_company_access_request(
  p_request_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  -- 被批准的申请资料。
  v_request public.company_access_requests%rowtype;

  -- 创建公司后保存其 id，并作为函数结果返回。
  v_company_id uuid;

  -- slug 是系统唯一标识，不直接使用可能重复的公司名称。
  v_company_slug text;
begin
  -- 调用者必须已登录。
  if auth.uid() is null then
    raise exception 'You must be signed in'
      using errcode = '42501';
  end if;

  -- 即使 Next.js 页面已经判断管理员身份，数据库仍必须独立验证。
  if not exists (
    select 1
    from public.platform_admins
    where user_id = auth.uid()
  ) then
    raise exception 'Only platform admins can approve access requests'
      using errcode = '42501';
  end if;

  -- 锁住申请行，避免两个管理员同时批准同一条申请。
  select *
  into v_request
  from public.company_access_requests
  where id = p_request_id
  for update;

  if not found then
    raise exception 'Access request not found'
      using errcode = 'P0002';
  end if;

  -- 只有 submitted 状态的申请可以被批准。
  if v_request.status <> 'submitted' then
    raise exception
      'Only submitted access requests can be approved. Current status: %',
      v_request.status
      using errcode = 'P0001';
  end if;

  -- 当前业务规定一个用户只能属于一家公司。
  if exists (
    select 1
    from public.company_members
    where user_id = v_request.user_id
  ) then
    raise exception 'Applicant already belongs to a company'
      using errcode = '23505';
  end if;

  -- request id 唯一，因此由它生成的 slug 也唯一。
  v_company_slug :=
    'company-' || replace(v_request.id::text, '-', '');

  -- 批准即代表公司门户已开通。
  insert into public.companies (
    name,
    slug,
    portal_status
  )
  values (
    v_request.company_name,
    v_company_slug,
    'active'
  )
  returning id into v_company_id;

  -- 申请人固定成为该公司的 owner。
  insert into public.company_members (
    company_id,
    user_id,
    role
  )
  values (
    v_company_id,
    v_request.user_id,
    'owner'
  );

  -- 批准即代表产品已开通，直接使用申请中的产品并设为 ready。
  insert into public.company_onboarding (
    company_id,
    onboarding_status,
    products
  )
  values (
    v_company_id,
    'ready',
    v_request.products
  );

  -- 所有开通数据成功后，最后才标记申请为 approved。
  update public.company_access_requests
  set status = 'approved'
  where id = v_request.id;

  return v_company_id;
end;
$$;

-- 默认 public 角色不应调用此函数。
revoke all on function public.approve_company_access_request(uuid) from public;

-- 登录用户可请求调用；函数内部会拒绝非平台管理员。
grant execute on function public.approve_company_access_request(uuid)
to authenticated;
