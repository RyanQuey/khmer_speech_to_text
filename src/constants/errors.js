export default {
  //error types
  //available levels: one of "ALERT", "WARNING", "DANGER", "BUG"
  FAILED_VALIDATION: {
    type: "FAILED_VALIDATION",
    level: "WARNING"
  },
  RECORD_ALREADY_EXISTS: {
    type: "RECORD_ALREADY_EXISTS",
    level: "WARNING"
  },
  REQUIRED_FIELDS: {
    type: "REQUIRED_FIELDS",
    level: "WARNING"
  },
  //when we add another column in the API, and want the user to add it, or other things that aren't really mistakes, but the API wants further information
  PROMPT_FOR_FURTHER_INPUT: {
    type: "PROMPT_FOR_FURTHER_INPUT",
    level: "ALERT"
  },
  FAILED_CREDENTIALS: {
    type: "FAILED_CREDENTIALS",
    level: "WARNING"
  },
  INVALID_ARGUMENTS: {
    type: "INVALID_ARGUMENTS",
    level: "BUG"
  },
}

