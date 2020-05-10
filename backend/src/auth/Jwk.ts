export interface Jwk {
    alg: string //is the algorithm for the key
    kty: string //is the key type
    use: string //is how the key was meant to be used. For the example above sig represents signature.
    x5c: string[] //is the x509 certificate chain
    e: string //is the exponent for a standard pem
    n: string //is the moduluos for a standard pem
    kid: string //is the unique identifier for the key
    x5t: string //is the thumbprint of the x.509 cert (SHA-1 thumbprint)
}

export interface JwkResult {
    data: {
        keys: Jwk[]
    }
}