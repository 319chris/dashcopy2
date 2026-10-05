-- 平台管理员可以读取所有公司接入申请。
-- 普通用户原有的“只能读取自己的申请” policy 保持不变。
create policy "Platform admins can view all access requests"
on public.company_access_requests
for select
to authenticated
using (
  exists (
    select 1
    from public.platform_admins
    where platform_admins.user_id = (select auth.uid())
  )
);
