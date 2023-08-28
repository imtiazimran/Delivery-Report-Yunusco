import React, { useContext } from 'react';
import { JobContext } from './Context/JobProvider';

const Stat = () => {
    const { jobs, prevJobs } = useContext(JobContext)

// --------------------Current Delivery Calculation--------------------------

const currentDeliveryQty = jobs.reduce((accumolator, currentJob) => accumolator + parseInt(currentJob.qty), 0)

// ------------------Previous Delivery--------------------------------
    const currentDate = new Date();

    // Calculate yesterday's date
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);


    // Filter deliveries for yesterday's date
    const yesterdayDeliveries = prevJobs.filter(currentJob => {
        if (currentJob.goodsDeliveryDate) { // Check if goodsDeliveryDate is not empty
            const deliveryDate = parseCustomDate(currentJob.goodsDeliveryDate);
            return isSameDate(deliveryDate, yesterdayDate);
        }
        return false; // Skip jobs without a valid delivery date
    });

    // Calculate total previous delivery quantity
    const totalPrevDelivery = yesterdayDeliveries.reduce((accumulator, currentJob) => {
        const qtyAsNumber = parseInt(currentJob.qty, 10); // Convert the string to an integer
        if (!isNaN(qtyAsNumber)) {
            return accumulator + qtyAsNumber;
        }
        return accumulator; // If conversion fails, return the accumulator unchanged
    }, 0);

    // ------------------------------------ Total Delivery Calculation----------------------------------

    const totalDelivery = prevJobs.reduce((accumulator, currentJob) => {
        const qtyAsNumber = parseInt(currentJob.qty); // Convert the string to an integer
        if (!isNaN(qtyAsNumber)) {
            return accumulator + qtyAsNumber;
        }
        return accumulator; // If conversion fails, return the accumulator unchanged
    }, 0);

    return (
        <div className='p-5 flex justify-center '>
            <div className="stats stats-vertical lg:stats-horizontal shadow ">

                <div className="stat text-center">
                    <div className="stat-title">Previous Delivery</div>
                    <div className="stat-value">{totalPrevDelivery.toLocaleString('en-IN')}</div>
                    <div className="stat-desc">{yesterdayDate.toLocaleDateString()}</div>
                </div>

                <div className="stat text-center">
                    <div className="stat-title">On Going</div>
                    <div className="stat-value">{currentDeliveryQty.toLocaleString("en-IN")}</div>
                    <div className="stat-desc">↗︎ </div>
                </div>

                <div className="stat text-center">
                    <div className="stat-title">Total Delivery</div>
                    <div className="stat-value">{totalDelivery.toLocaleString("en-IN")}</div>
                </div>

            </div>
        </div>
    );
};



// Helper function to parse a date in the format "DD-MM-YYYY HH:MM:SS"
function parseCustomDate(dateString) {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hours, minutes, seconds] = timePart.split(':');
    return new Date(year, month - 1, day, hours, minutes, seconds);
}

// Helper function to check if two dates are the same
function isSameDate(date1, date2) {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}

export default Stat;