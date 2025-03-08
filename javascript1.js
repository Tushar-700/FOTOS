const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
        gateway: 'example',
        gatewayMerchantId: 'gatewayMerchantId',
    }
};
const cardPaymentMethod = {
    type: 'CARD',
    tokenizationSpecification: tokenizationSpecification,
    parameters: {
        allowedCardNetworks: ['VISA', 'MASTERCARD'],
        allowedAuthMethods: ['PAN_ONLY'],
    }
};
const googlePayConfiguration = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowPaymentMethods: [cardPaymentMethod],
};
let googlePayClient;




/**
 * Defines and handles the main operations related to the integration of 
 * Google Pay. This function is executed when the Google Pay library script has 
 * finished loading.
 */



function onGooglePayLoaded() {
    googlePayClient = new google.payments.api.PaymentsClient({
        environment: 'TEST',
    });

    googlePayClient.isReadyToPay(googlePayConfiguration)
        .then(response => {
            if (response.result) {
                createAndAddButton();
            }
            else {
                // the current user cannot pay using Google Pay. Offer another
                //payment method
            }
        })
        .catch(error => console.error('isReadyToPay error: ', error));
}

/**
 * Handles the creation of the button to pay with Google Pay.
 * Once created, this button is appended to the DOM, under the element
 * 'buy-now'.
 */
function createAndAddButton() {
    const googlePayButton = googlePayClient.createButton({
        onClick: onGooglePayButtonClicked,
    });

    document.getElementById('Buy Now').appendChild(googlePayButton);
}

/**
 * Handles the click of the button to pay with google pay.takes
 * care of defining the payment data request to be used in order to load
 * the payments  methods available to the user
 */
function onGooglePayButtonClicked() {
    const paymentsDataRequest = { ...googlePayConfiguration };
    paymentsDataRequest.merchatInfo = {
        merchantId: 'BCR2DN4T77OOZPJX',
        merchantName: 'S&R Dresses',
    };

    paymentDataRequset.transactionInfo = {
        totalPriceStatus: 'FINAL',
        totalPrice: selectedItem.price,
        currecyCode: 'INR',
        countruCode: 'IN',

    };

    googlePayClient.loadPaymentData(paymentsDataRequest)
        .then(paymentData => processPaymentData(paymentData))
        .catch(error => console.error('loadPaymentData error: ', error));

}

function processPaymentData(paymentData) {
    fetch(ordersEndpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/S&R'
      },
      body: paymentData  
    })
}