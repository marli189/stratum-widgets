var RRCT_BASE_URL = "";
const _apiKey = "JjaQCqCCWz8=";

export function setRrctBaseUrl(baseUrl) {
    RRCT_BASE_URL = baseUrl;
}

export function getCandidates() {
    return getResource(RRCT_BASE_URL + "/candidates?apikey=" + _apiKey);
}

export function getUnits() {
    return getResource("/stratum/api/metadata/units/register/110?apikey=" + _apiKey);
}

function getResource(resource) {
    var deferred = new Ext.Deferred();
    Ext.Ajax.request({
        url: resource,
        success: function (response) {
            if(response.status !== 200){
                deferred.reject();
            }
            var responseJson = Ext.util.JSON.decode(response.responseText);
            if(responseJson.success === false || responseJson.code !== 0) {
                deferred.reject();
            }
            deferred.resolve(responseJson.data);
        },
        failure: function (response) {
            if(response.responseText) {
                var responseJson = Ext.util.JSON.decode(response.responseText);
                deferred.reject(responseJson);
            }
            else {
                deferred.reject("An unknown error occurred while getting resource: " + resource);
            }
        }
    });

    return deferred.promise;
}
