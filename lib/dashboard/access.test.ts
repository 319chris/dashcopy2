  import { describe, expect, it } from "vitest";
  import { getProductAccessState } from "./access";
  import type { DashboardViewer } from "./types";

  const chatbotViewer: DashboardViewer = {
    user: {
      id: "user_1",
      email: "test@example.com",
    },
    company: {
      id: "company_1",
      name: "Test Company",
      slug: "test-company",
      portalStatus: "active",
      products: ["chatbot"],
      onboardingStatus: "ready",
    },
    companyRole: "owner",
    isAuthenticated: true,
    hasMembership: true,
  };

    describe("getProductAccessState", () => {
    it("rejects Voice Agent when only Chatbot is enabled", () => {
      const accessState = getProductAccessState(
        chatbotViewer,
        "voice_agent",
      );

      expect(accessState).toBe("product_unavailable");
    });


    it("allows Chatbot when Chatbot is enabled", () => {
    const accessState = getProductAccessState(
      chatbotViewer,
      "chatbot",
    );

    expect(accessState).toBe("ready");
    });


    it("keeps a company with no products in setup pending", () => {
    const noProductsViewer: DashboardViewer = {
      ...chatbotViewer,
      company: {
        ...chatbotViewer.company!,
        products: [],
      },
    };

    const accessState = getProductAccessState(
      noProductsViewer,
      "chatbot",
    );

    expect(accessState).toBe("setup_pending");
    });

    it("preserves signed-out status before checking products", () => {
    const signedOutViewer: DashboardViewer = {
      ...chatbotViewer,
      isAuthenticated: false,
      hasMembership: false,
      company: null,
      companyRole: null,
    };

    const accessState = getProductAccessState(
      signedOutViewer,
      "chatbot",
    );

    expect(accessState).toBe("signed_out");
    });
    it("preserves unmapped status before checking products", () => {
    const unmappedViewer: DashboardViewer = {
      ...chatbotViewer,
      user: null,
      company: null,
      companyRole: null,
      hasMembership: false,
    };

    const accessState = getProductAccessState(
      unmappedViewer,
      "chatbot",
    );

    expect(accessState).toBe("unmapped");
    });


    });