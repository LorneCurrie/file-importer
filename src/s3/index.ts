import { S3 } from 'aws-sdk';

export class S3Client {

  private client: S3;

  constructor(private bucket: string, region: string | null = null) {
    this.client = new S3({
      apiVersion: '2012-11-05',
      ...(region && { region }),
    })
  }

  public getFile = (key: string) => this.getObject(key).promise()
  public getFileStream = (key: string) => this.getObject(key).createReadStream()

  public listFiles = (objectPath: string = '/') => { }
  public moveFile = (fromObjectPath: string, toObjectPath: string) => { }

  private getObject = (key: string) =>
    this.client.getObject({
      Bucket: this.bucket,
      Key: key,
    })
}