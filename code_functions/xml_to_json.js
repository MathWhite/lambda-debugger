module.exports = {
    execFunctionAsync: async function exec(_inputs, _wevo) {
        const xmljs = _wevo.utils.xmltojson;

        try {

            if (!_inputs.xml) throw new Error("Field [xml] is required");

            let response = {};

            try {

                let json = convertXmltoJson(_inputs.xml);

                response = {
                    Response: json,
                    Success: true,
                    Message: "Success"
                };

            }
            catch (err) {
                response = {
                    Response: null,
                    Success: false,
                    Message: err.toString()
                };
            }

            return response
        }
        catch (err) {
            return {
                Response: null,
                Success: false,
                Message: err.toString()
            }
        }

        function convertXmltoJson(_xmlString) {
            try {

                let ignoreAttributes = true;

                if (_inputs.hasOwnProperty("ignoreAttributes")) {
                    ignoreAttributes = _inputs.ignoreAttributes;
                }

                let options = {
                    compact: true,
                    ignoreAttributes: ignoreAttributes,
                    ignoreComment: true,
                    ignoreDoctype: true,
                    ignoreDeclaration: true,
                    textFn: removeJsonTextAttribute,
                };

                let jsonObj = xmljs.xml2json(_xmlString, options);

                /* 
                Utilizando o parametro de Reviver do JSON.parse
                para limpar objetos vazios gerados pela lib de conversão
                */
                let cleanJson = JSON.parse(jsonObj, removeEmpty);

                return cleanJson;

            } catch (err) {
                throw err;
            }
        }

        function removeJsonTextAttribute(value, parentElement) {
            try {
                let keyNo = Object.keys(parentElement._parent).length;
                let keyName = Object.keys(parentElement._parent)[keyNo - 1];
                let nativeTypeValue = nativeType(value);
                parentElement._parent[keyName] = nativeTypeValue;
            } catch (error) { }
        }

        function nativeType(value) {
            // let nValue = Number(value);
            // if (!isNaN(nValue)) {
            //     return nValue;
            // }
            let bValue = value.toLowerCase();
            if (bValue === 'true') {
                return true;
            } else if (bValue === 'false') {
                return false;
            }
            return value;
        }

        function removeEmpty(key, value) {

            if (!value) return;

            if (key == "xs:schema") return;

            if (value.constructor == Object && Object.keys(value).length == 0) {
                return null;
            }

            return value;
        }
    }
}