import APIContracts from "authorizenet/lib/apicontracts.js";
import APIControllers from "authorizenet/lib/apicontrollers.js";
import _ from "lodash";
import Booking from "../models/booking.js";

export default async function (req, res, next) {
  const booking = await Booking.findOne({ booking_id: req.body.booking_id });
  var merchantAuthenticationType =
    new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.AUTHORIZE_DOTNET_API_LOGIN_ID);
  merchantAuthenticationType.setTransactionKey(
    process.env.AUTHORIZE_DOTNET_TRANSACTION_KEY
  );

  var creditCard = new APIContracts.CreditCardType();
  creditCard.setCardNumber(booking.contact_details.card_number);
  creditCard.setExpirationDate(booking.contact_details.exp);

  var paymentType = new APIContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  var transactionRequestType = new APIContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    APIContracts.TransactionTypeEnum.REFUNDTRANSACTION
  );
  transactionRequestType.setRefTransId(booking.transaction_id);
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(booking.price_breakup.total_fare);

  var creditCardRequest = new APIContracts.CreateTransactionRequest();
  creditCardRequest.setMerchantAuthentication(merchantAuthenticationType);
  creditCardRequest.setTransactionRequest(transactionRequestType);

  let ctrl = new APIControllers.CreateTransactionController(
    creditCardRequest.getJSON()
  );

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new APIContracts.CreateTransactionResponse(apiResponse);

    //pretty print response
    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        APIContracts.MessageTypeEnum.OK
      ) {
        if (response.getTransactionResponse().getMessages() != null) {
          next();
        } else {
          if (response.getTransactionResponse().getErrors() != null) {
            res
              .status(400)
              .json(
                response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorText()
              );
          }
        }
      } else {
        if (
          response.getTransactionResponse() != null &&
          response.getTransactionResponse().getErrors() != null
        ) {
          res
            .status(400)
            .json(
              response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorText()
            );
        } else {
          res
            .status(400)
            .json(
              "Error message: " +
                response.getMessages().getMessage()[0].getText()
            );
        }
      }
    } else {
      res.status(400).json("Null response");
    }
  });
}
