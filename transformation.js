exports.handler = async (_inputs, _wevo) => {
    try {
        const exemplo = JSON.parse(_inputs.exemplo);
        
        _wevo.logMessage.info(exemplo[0].sas);
        let something = await _wevo.dynamicStorage.getFirstAsync("exemplo");

        return JSON.stringify(something);
    }
    catch(error){
        _wevo.logMessage.error(error.toString());
        
    }   

}
