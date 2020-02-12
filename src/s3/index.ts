import { AWSError, S3, Request } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { Readable } from 'stream';

export class S3Client {

  private client: S3;

  constructor(private bucket: string, region: string | null = null) {
    this.client = new S3({
      apiVersion: '2012-11-05',
      ...(region && { region }),
    })
  }

  public getFile = (key: string): Promise<PromiseResult<S3.GetObjectOutput, AWSError>> => this.getObject(key).promise();
  public getFileStream = (key: string): Readable => this.getObject(key).createReadStream();

  private getObject = (key: string): Request<S3.GetObjectOutput, AWSError> =>
    this.client.getObject({
      Bucket: this.bucket,
      Key: key,
    })
}
