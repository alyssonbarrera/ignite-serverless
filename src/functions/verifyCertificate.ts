import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

interface IUsersCertificate {
    id: string;
    name: string;
    grade: string;
    created_at: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const { id } = event.pathParameters;

    const response = await document.query({
        TableName: "certificate-users",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
        }
    }).promise();

    const userCertificate = response.Items[0] as IUsersCertificate;

    if (userCertificate) {
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "Certificado válido",
                name: userCertificate.name,
                url: `https://ignite-certificate-serverless-alysson.s3.us-east-1.amazonaws.com/${userCertificate.id}.pdf`
            }),
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "Certificado inválido",
        }),
    }
}