import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class ImageAccess {
    constructor(
        private readonly s3 = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly bucketName = process.env.IMAGES_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) { }

    async getAccessUrl(imageId: string) {
        logger.info('Getting image access url for id', { imageId })
        return `https://${this.bucketName}.s3.amazonaws.com/${imageId}`
    }

    async getUploadUrl(imageId: string) {
        logger.info('Getting image signed url for id', { imageId })
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: imageId,
            Expires: this.urlExpiration
        })
    }
}