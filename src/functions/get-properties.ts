import {DocumentClient} from "aws-sdk/clients/dynamodb";

export const handler = async () => {
    let client: DocumentClient = undefined;

    if (process.env.IS_OFFLINE) {
        client = new DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000',
            accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
            secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
        })
    } else {
        client = new DocumentClient();
    }

    var params: DocumentClient.QueryInput = {
        TableName: 'dev-properties-table',
        IndexName: 'itemTypeGSI',
        KeyConditionExpression: 'propertyType = :val', // a string representing a constraint on the attribute
        //FilterExpression: 'attr_name = :val', // a string representing a constraint on the attribute
        // ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
        //     '#name': 'attribute name'
        // },
        ExpressionAttributeValues: { // a map of substitutions for all attribute values
            //':value': 'STRING_VALUE',
            ':val': 0
        },
        ScanIndexForward: true, // optional (true | false) defines direction of Query in the index
        Select: 'ALL_ATTRIBUTES', // optional (ALL_ATTRIBUTES | ALL_PROJECTED_ATTRIBUTES |
                                  //           SPECIFIC_ATTRIBUTES | COUNT)
        ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
    };
    let result = await client.query(params).promise();
    return {
        statusCode: 200,
        body: JSON.stringify({
            items: result.Items,
            lastEvaluatedKey: result.LastEvaluatedKey || null
        })
    }
};
