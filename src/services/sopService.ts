// src/services/sopService.ts
import { getApi } from "@/api/api";

export const sopService = {
  // Send FormData with "payload" (JSON string) and "resume" (File)
  async submitSop(appData: FormData) {
    const { data } = await getApi().post("/api/v1/sop/submit", appData);
    return data as { message: string; id: number };
  },

  // Use path with sop_id segment per your implementation
  async sopQualityCheck(sop_id: number) {
    const { data } = await getApi().post(`/api/v1/sop/quality-check/${sop_id}`);
    return data as {
      success: boolean;
      error: string | null;
      details: any;
      data: {
        phase: string;
        quality_result: {
          current_score: number;
          questions_to_improve: string[];
        };
      };
    };
  },

  // NOTE: keep the method name, but accept a payload that includes improvement_answers
  async improvementSuggestions(
    sop_id: number,
    payload: { improvement_answers: Record<string, string> }
  ) {
    const { data } = await getApi().post(
      `/api/v1/sop/finalize/${sop_id}`,
      payload
    );
    return data as {
      message: string;
      sop_path: string;
      email_sent: boolean;
    };
  },

  async verifyPayment(sop_id: number, output_pdf: string) {
    const { data } = await getApi().post(
      `/api/v1/sop/verify-payment/${sop_id}/${output_pdf}`
    );
    return data as { message: string };
  },
};
