export default function bookingMade(booking, vehicle_details) {
  return `<!DOCTYPE html>
  <html>
  
  <head>
      <style>
          * {
              font-family: "Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif;
          }
  
          .mail-container {
              width: 500px !important;
              border: green 2px solid;
              padding: 10px;
          }
  
          .fs-sm {
              font-size: 0.7rem;
          }
  
          .fs-md {
              font-size: 0.8rem;
          }
  
          .container {
              padding: 1rem;
          }
  
          .mx-auto {
            margin-left: auto;
            margin-right: auto;
          }
  
          .text-center {
              text-align: center;
          }
  
          .my-3 {
              margin-top: 1rem;
              margin-bottom: 1rem;
          }
  
          .mt-3 {
              margin-top: 1rem;
          }
  
          .mb-3 {
              margin-bottom: 1rem;
          }
  
          .mb-2 {
              margin-bottom: 0.8rem;
          }
  
          .d-block {
              display: block;
          }
  
          .fw-bold {
              font-weight: bold;
          }
  
          .table {
              width: 100%;
              box-sizing: border-box;
              border-collapse: collapse;
          }
  
          .table td {
              padding: 0.8rem;
              border: 1px solid lightgrey;
              table-layout: auto;
          }
  
          .text-danger {
              color: red;
          }
      </style>
  </head>
  
  <body>
      <div class="container my-4">
          <div class="mail-container mx-auto">
              <div class="text-center fw-bold fs-sm">Greetings! Thanks for booking your ride with us!</div>
              <div class="text-center fw-bold fs-5 my-3">Airport Limo Service</div>
              <div class="text-center fw-bold fs-sm my-3">Your booking is made - Booking No.: ${
                booking.booking_id
              }</div>
              <table class="table table-bordered">
                  <tbody class="fs-md">
                      <tr>
                          <td>
                              <p>Passenger Name and Contact
                              </p>
                          </td>
                          <td>
                              <p>${booking.contact_details.fullname} : ${
    booking.contact_details.phone
  }
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <p>Date and Time
                              </p>
                          </td>
                          <td>
                              <p>${new Date(booking.pickupdatetime).toString()}
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <p>Pickup Location
                              </p>
                          </td>
                          <td>
                              <p>${booking.from}
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <p>Drop Location
                              </p>
                          </td>
                          <td>
                              <p>${booking.to}
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <p>Option Selected
                              </p>
                          </td>
                          <td>
                              <p>${booking.rideType}
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <p>Passengers and Luggage
                              </p>
                          </td>
                          <td>
                              <p>Passengers = ${
                                vehicle_details.passenger_capacity
                              } : Luggage = ${vehicle_details.luggage_capacity}
                              </p>
                          </td>
                      </tr>
                  </tbody>
              </table>
  
              <div class="fs-md fw-bold my-3">Price Breakup</div>
              <table class="table table-bordered fs-md">
                  <tbody>
                      <tr>
                          <td>
                              <p>${vehicle_details.name}
                              </p>
                          </td>
                          <td>
                              <p>${booking.price_breakup.vehicle_fare}.00
                              </p>
                          </td>
                      </tr>
                      ${
                        booking.price_breakup.toll_price &&
                        `<tr>
                              <td>
                                  <p>Airport Toll
                                  </p>
                              </td>
                              <td>
                                  <p>${booking.price_breakup.toll_price}.00
                                  </p>
                              </td>
                          </tr>`
                      }
                      <tr>
                          <td>
                              <p>Subtotal
                              </p>
                          </td>
                          <td>
                              <p>${(
                                booking.price_breakup.total_fare *
                                (5 / 6)
                              ).toFixed(2)}
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <p>Gratuity
                              </p>
                          </td>
                          <td>
                              <p>${(
                                booking.price_breakup.total_fare -
                                booking.price_breakup.total_fare * (5 / 6)
                              ).toFixed(2)}
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <p>Total
                              </p>
                          </td>
                          <td>
                              <p>${booking.price_breakup.total_fare}.00
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <p><b>Booking Amount (PAID)
                                  </b>
                              </p>
                          </td>
                          <td>
                              <p><b>$ ${booking.price_breakup.total_fare.toFixed(
                                2
                              )}
                                  </b>
                              </p>
                          </td>
                      </tr>
                  </tbody>
              </table>
  
              <div class="fs-md fw-bold my-3">Card Customer Details</div>
              <table class="table table-bordered fs-sm">
                  <tbody>
                      <tr>
                          <td>
                              <p>Name and Contact
                              </p>
                          </td>
                          <td>
                              <p>${booking.contact_details.fullname} : ${
    booking.contact_details.phone
  }
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <p>Email Address
                              </p>
                          </td>
                          <td>
                              <p>${booking.contact_details.email}
                              </p>
                          </td>
                      </tr>
                  </tbody>
              </table>
  
              <div class="text-center fw-bold fs-md mt-3">Questions about this us?</div>
              <div class="text-center fs-md">Email us at <a href="mailto:admin@leetwolf.com">admin@leetwolf.com</a></div>
              <div class="text-danger fs-md mt-3">
                  If you are getting this mail in the SPAM FOLDER please click <span class="fw-bold">NOT SPAM</span> button and move this email to you inbox to ensure future correspondence is delivered to your inbox.
              </div>
              <div class="fs-md mt-3">
                  * This mail is not unsolicited. This is in response to your activity and request at <a href="https://www.leetwolf.com">https://www.leetwolf.com</a> . If you feel this mail was wrongly addressed to you please delete it.
                  <br /><br />
                  * Do not take print outs of this Email unless it is absolutely necessary. Lets save trees and make the planet greener.
              </div>
              <a href="https://leetwolf.com/about/" class="mt-3 d-block fs-md"> Terms and Conditions</a>
          </div>
  
      </div>
  </body>
  
  </html>`;
}
