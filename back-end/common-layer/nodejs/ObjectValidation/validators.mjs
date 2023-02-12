// ////////////////////////////////////////////////////////////////////////////
//
//  All custom validation functions that can be shared between schemas should
//  be placed here and imported into the schema file.
//


// ISO 8601
const timestampValidator = (val) => /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(val)

export { timestampValidator }