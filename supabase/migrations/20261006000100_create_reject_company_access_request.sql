-- 平台管理员拒绝一条公司接入申请。
-- 拒绝不会创建公司、成员关系或 onboarding。

create or replace function public.reject_company_access_request(
  p_request_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  -- 保存并锁定将要拒绝的申请。
  v_request public.company_access_requests%rowtype;
begin
  -- 必须由已登录用户发起。
  if auth.uid() is null then
    raise exception 'You must be signed in'
      using errcode = '42501';
  end if;

  -- 数据库自己确认调用者是平台管理员。
  if not exists (
    select 1
    from public.platform_admins
    where user_id = auth.uid()
  ) then
    raise exception 'Only platform admins can reject access requests'
      using errcode = '42501';
  end if;

  -- 锁住这一行，避免两个管理员同时审核。
  select *
  into v_request
  from public.company_access_requests
  where id = p_request_id
  for update;

  -- 申请不存在时停止。
  if not found then
    raise exception 'Access request not found'
      using errcode = 'P0002';
  end if;

  -- 已批准或已拒绝的申请都不能再次处理。
  if v_request.status <> 'submitted' then
    raise exception
      'Only submitted access requests can be rejected. Current status: %',
      v_request.status
      using errcode = 'P0001';
  end if;

  -- 拒绝只改变申请状态。
  update public.company_access_requests
  set status = 'rejected'
  where id = v_request.id;
end;
$$;

-- 默认 public 角色不能调用。
revoke all on function public.reject_company_access_request(uuid) from public;

-- 登录用户可以发起请求；函数内部会拒绝非管理员。
grant execute on function public.reject_company_access_request(uuid)
to authenticated;
