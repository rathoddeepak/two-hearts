import Datastore from 'react-native-local-mongodb';
const tokenStore = new Datastore({filename: 'tokenStore', autoload: true});
const APPEND_FETCH = 0;
const NEW_FETCH = 0;
function GetToken(issuer, setter){	
	tokenStore.find({issuer:issuer}, (err, docs) => {
	  if(err == null && docs.length > 0)
	  	setter(docs[0]['token']);
	  else
	  	setter(0);
	});
}
function StoreToken(issuer, token){
	tokenStore.findOne({issuer}, (err, doc) => {
	  if(err == null && doc != null)
	  	tokenStore.remove({issuer}, { multi: true }, (err, numRemoved) => tokenStore.insert({issuer,token},  (err, newDoc) => {
	  		//console.log(err);
	  		//console.log(newDoc);
	  	}));		
	  else
	  	tokenStore.insert({issuer,token},  (err, newDoc) =>	{
	  		//console.log(err);
	  		//console.log(newDoc);
	  	});
	});

	
}
function FlushToken(){
	tokenStore.remove({}, { multi: true }, (err, numRemoved) => {});
}
export {
	GetToken,
	StoreToken,
	FlushToken,
	APPEND_FETCH,
	NEW_FETCH
}