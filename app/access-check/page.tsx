import {
  getAccessState,
  type DashboardAccessState,
} from "@/lib/dashboard/access";
import type { DashboardViewer } from "@/lib/dashboard/types";

type CheckCase = {
  name: string;
  viewer: DashboardViewer;
  expected: DashboardAccessState;
};

const readyCompany: NonNullable<DashboardViewer["company"]> = {
  id: "company_1",
  name: "Demo Company",
  slug: "demo-company",
  portalStatus: "active",
  products: ["chatbot"],
  onboardingStatus: "ready",
};

const checks: CheckCase[] = [
  {
    name: "未登录",
    viewer: {
      user: { id: "user_1", email: "test@example.com" },
      company: null,
      companyRole: null,
      isAuthenticated: false,
      hasMembership: false,
    },
    expected: "signed_out",
  },
  {
    name: "没有用户映射",
    viewer: {
      user: null,
      company: null,
      companyRole: null,
      isAuthenticated: true,
      hasMembership: false,
    },
    expected: "unmapped",
  },
  {
    name: "尚未完成设置",
    viewer: {
      user: { id: "user_1", email: "test@example.com" },
      company: null,
      companyRole: null,
      isAuthenticated: true,
      hasMembership: false,
    },
    expected: "setup_pending",
  },
  {
    name: "全部条件满足",
    viewer: {
      user: { id: "user_1", email: "test@example.com" },
      company: readyCompany,
      companyRole: "owner",
      isAuthenticated: true,
      hasMembership: true,
    },
    expected: "ready",
  },
];

export default function AccessCheckPage() {
  const results = checks.map((check) => {
    const actual = getAccessState(check.viewer);

    return {
      ...check,
      actual,
      passed: actual === check.expected,
    };
  });

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Dashboard access check</h1>
      <p className="mt-2 text-sm text-gray-600">
        四个假 viewer 直接调用 getAccessState()；不需要 Supabase 或环境变量。
      </p>

      <ul className="mt-6 space-y-3">
        {results.map((result) => (
          <li
            className="rounded border p-4"
            key={result.name}
          >
            <p className="font-medium">
              {result.passed ? "✅" : "❌"} {result.name}
            </p>
            <p className="mt-1 text-sm">
              期望：<code>{result.expected}</code>；实际：<code>{result.actual}</code>
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
