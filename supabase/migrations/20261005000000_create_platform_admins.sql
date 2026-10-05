-- 平台管理员名单；与客户公司内部的 owner/member/admin 角色完全分离。
create table public.platform_admins (
  -- 直接使用 Auth 用户 ID 作为主键，确保一个用户最多一条平台管理员记录。
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 默认拒绝所有 API 访问，后续只开放最小必要读取权限。
alter table public.platform_admins enable row level security;

-- 登录用户只能查询自己是否是平台管理员，不能读取其他员工名单。
create policy "Users can check their own platform admin status"
on public.platform_admins
for select
to authenticated
using ((select auth.uid()) = user_id);

-- 故意不创建 insert/update/delete policy：
-- 普通用户不能通过浏览器给自己授予平台管理员权限。
