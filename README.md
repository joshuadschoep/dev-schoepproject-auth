# lambda-authorization

Lambda Function to authorize CloudFront requests against a JWT and ensure that specific roles shall grant access.

This project is based upon work done by Jason Legler for the project:

> Code:
>
> https://github.com/aws-samples/lambdaedge-openidconnect-samples

> Original blog post:
>
> https://aws.amazon.com/blogs/networking-and-content-delivery/securing-cloudfront-distributions-using-openid-connect-and-aws-secrets-manager/

At the time of creation, the original code and repository above were under the MIT License, with copyright reserved by Amazon.com Inc.

---

For more instruction on how to use this repository or the original Amazon code sample, see the above blog post. It outlines the steps to use their CloudFormation sample to create a full front-end stack, including the CloudFront distro and S3 bucket. 

This snippet, however, only sets up the Lambda@Edge method.