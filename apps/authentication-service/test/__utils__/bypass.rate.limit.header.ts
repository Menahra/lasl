import { BYPASS_RATE_LIMIT_HEADER_NAME } from "@lasl/app-contracts/api/headers";
import { TEST_RATE_LIMIT_BYPASS_KEY } from "@/test/__utils__/environment.setup.ts";

export const BYPASS_RATE_LIMIT_HEADER = {
  [BYPASS_RATE_LIMIT_HEADER_NAME]: TEST_RATE_LIMIT_BYPASS_KEY,
};
