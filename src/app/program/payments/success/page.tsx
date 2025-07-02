import { confirmPayments } from 'api';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const PaymentsSuccess = () => {
    const params = useSearchParams();
    useEffect(() => {
        async function successFn() {
            try {
                // {
                //     "orderId": "string",
                //     "programId": 0,
                //     "amount": 0,
                //     "paymentKey": "string",
                //     "scheduleId": 0
                //   }
                const values = {
                    // orderId: 
                }
                const res = await confirmPayments(values);
                console.log(res);
            } catch(err) {console.log(err)}
        }
        successFn();
    }, []);
    return (
        <div>
            결제 성공!
        </div>
    );
};

export default PaymentsSuccess;