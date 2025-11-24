import _ from 'lodash';

export default {

    prefix: '/v1',

    get: {
        '/models': async () => {
            return {
                "data": [
                    {
                        "id": "doubao",
                        "object": "model",
                        "owned_by": "doubao-free-api"
                    }
                ]
            };
        }

    }
}