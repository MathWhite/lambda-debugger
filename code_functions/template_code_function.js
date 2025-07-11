module.exports = {
    execFunctionAsync: async function exec(_inputs, _wevo) {
        //coloque seu codigo dentro desse escopo, ou a funcao nao funcionará
        //esse é um template de codeFunction, para funcionar devidamente, 
        // deverá manter seu codigo dentro do execFunctionAsync que está dentro de module.exports

        try {

        }
        catch (error) {
            _wevo.logMessage.error(error.toString());
        }

    }
}