export function translate(errorCode: string) {
  switch (errorCode) {
    case 'Configuration':
      return 'Server is incorrectly configured'
    case 'AccessDenied':
      return 'Access was denied'
    case 'Verification':
      return 'The token has expired or has already been used'
    default:
      return 'Forbidden action'
  }
}
