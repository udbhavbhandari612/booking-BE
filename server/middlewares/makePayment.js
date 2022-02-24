import APIContracts from "authorizenet/lib/apicontracts.js";
import APIControllers from "authorizenet/lib/apicontrollers.js";
import _ from "lodash";

export default async function (req, res, next) {
  var merchantAuthenticationType =
    new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.AUTHORIZE_DOTNET_API_LOGIN_ID);
  merchantAuthenticationType.setTransactionKey(
    process.env.AUTHORIZE_DOTNET_TRANSACTION_KEY
  );

  var paymentType = new APIContracts.PaymentType();
  var opaqueData = new APIContracts.OpaqueDataType();
  opaqueData.setDataDescriptor(req.body.opaqueData.dataDescriptor);
  opaqueData.setDataValue(req.body.opaqueData.dataValue);
  paymentType.setOpaqueData(opaqueData);
  var transactionRequestType = new APIContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );
  transactionRequestType.setPayment(paymentType);
  const total_fare =
    req.body.vehicle_details.total_fare +
    (req.body.vehicle_details.child_seats || 0) * 5 +
    (req.body.toll_price || 0) +
    (req.body.morning_rush_hour_price || 0) +
    (req.body.night_rush_hour_price || 0) +
    (req.body.meet_and_greet ? 5 : 0);
  transactionRequestType.setAmount(
    `${Math.ceil(total_fare + (total_fare * 20) / 100)}.00`
  );

  var createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  var ctrl = new APIControllers.CreateTransactionController(
    createRequest.getJSON()
  );
  //Defaults to sandbox
  //ctrl.setEnvironment(SDKConstants.endpoint.production);

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new APIContracts.CreateTransactionResponse(apiResponse);

    //pretty print response
    console.log(JSON.stringify(response, null, 2));
    req.result = JSON.parse(JSON.stringify(response));
    req.result.price_breakup = {
      vehicle_fare: req.body.vehicle_details.total_fare,
      toll_price: req.body.toll_price,
      morning_rush_hour_price: req.body.morning_rush_hour_price,
      night_rush_hour_price: req.body.night_rush_hour_price,
      child_seats_price: (req.body.vehicle_details.child_seats || 0) * 5,
      gratuity: total_fare / 5,
      total_fare: total_fare + total_fare / 5,
      meet_and_greet: req.body.meet_and_greet ? 5 : 0,
    };
    next();
  });
}
