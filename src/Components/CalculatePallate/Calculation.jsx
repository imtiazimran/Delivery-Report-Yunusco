
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion"
import DatePicker from 'react-datepicker';
import { useAddJobMutation } from "../Redux/api/addJobApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const CalculatePalette = () => {
    const [inputCount, setInputCount] = useState(2);
    const [result, setResult] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const currentDate = new Date();
    const datePickerRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const location = useNavigate()
    const [addJob, { isLoading }] = useAddJobMutation()
    const handleFocus = (index) => {
        if (index === inputCount - 1) {
            setInputCount(prevCount => prevCount + 1);
        }
    };

    const onSubmit = (data) => {
        const { ups, label, po, customer } = data
        console.log(data);
        const calculateStickerDistribution = async (capacity) => {
            const sizes = Array.from({ length: inputCount }, (_, i) => parseInt(data[`size${i + 1}`]))
                .filter(value => !isNaN(value));

            const totalQty = sizes.reduce((acc, qty) => acc + qty, 0);
            const totalSheetsNeeded = Math.ceil(totalQty / capacity);

            // Calculate the distribution for each size
            const stickerDistribution = sizes.map(qty => Math.ceil(qty / totalSheetsNeeded));

            // Adjust the distribution to fit within the capacity
            let totalStickersOnSheets = stickerDistribution.reduce((acc, qty) => acc + qty, 0);

            // Prioritize reduction from sizes with the largest quantities
            const maxVal = Math.max(...sizes)
            const maxUps = Math.max(...stickerDistribution)

            const maxValueCalculation = totalSheetsNeeded * maxUps

            console.log(maxVal, maxUps, maxValueCalculation);
            while (maxVal > maxValueCalculation) {
                totalSheetsNeeded++;
            }


            const jobData = { ups, label, po, customer, sizes, capacity, ExpectedDate: selectedDate, stickerDistribution, impression: totalSheetsNeeded, qty: totalQty, totalCapacity: totalStickersOnSheets }

            setResult(jobData);
            return { stickerDistribution, totalSheetsNeeded, totalQty, totalStickersOnSheets };
        };


        calculateStickerDistribution(parseInt(data.ups));

    };

    const handlePostData = async () => {
        setResult(null)
        const res = await addJob(result)
        if (res?.data?.result?.insertedId) {
            location('/')
        } else if (res.error?.status === 400) {
            Swal.fire({
                position: 'top-center',
                icon: 'error',
                title: res?.error?.data?.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }
    return (
        <div className="my-20 relative">
            <form className="md:w-1/2 w-3/4 mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <div>
                        <label htmlFor="ups">Tray Capacity</label>
                        <motion.input
                            initial={{ scale: 0.8 }}
                            animate={{
                                rotate: 0,
                                scale: 0.9,
                                transition: { duration: 0.3 }
                            }}
                            whileFocus={{
                                scale: 1
                            }}
                            {...register('ups', { required: true })} className="w-full border-gray-500 focus:ring-purple-600" type="number" id="ups" />
                        {errors.ups && <p className="text-red-500">This field is required</p>}
                    </div> */}
                    <div>
                        <label htmlFor="customer">Customer</label>
                        <motion.input
                            initial={{ scale: 0.8 }}
                            animate={{
                                rotate: 0,
                                scale: 0.9,
                                transition: { duration: 0.3 }
                            }}
                            whileFocus={{
                                scale: 1
                            }}
                            {...register('customer', { required: true })}
                            className="w-full border-gray-500 focus:ring-purple-600"
                            type="text"
                            id="customer"
                        />

                        {errors.customer && <p className="text-red-500">This field is required</p>}
                    </div>
                    <div>
                        <label htmlFor="po">Job No</label>
                        <motion.input
                            initial={{ scale: 0.8 }}
                            animate={{
                                rotate: 0,
                                scale: 0.9,
                                transition: { duration: 0.3 }
                            }}
                            whileFocus={{
                                scale: 1
                            }}
                            {...register('po', { required: true })}
                            className="w-full border-gray-500 focus:ring-purple-600"
                            type="text"
                            id="po" />
                        {errors.po && <p className="text-red-500">This field is required</p>}
                    </div>
                    <div>
                        <label htmlFor="label">Label Name</label>
                        <motion.input
                            initial={{ scale: 0.8 }}
                            animate={{
                                rotate: 0,
                                scale: 0.9,
                                transition: { duration: 0.3 }
                            }}
                            whileFocus={{
                                scale: 1
                            }}
                            {...register('label', { required: true })}
                            className="w-full border-gray-500 focus:ring-purple-600"
                            type="text"
                            id="label"
                        />
                        {errors.ups && <p className="text-red-500">This field is required</p>}
                    </div>


                    <div className="flex flex-col mb-5">
                        <label htmlFor="title" className="mb-2">
                            Expected Delivery Date
                        </label>
                        <DatePicker
                            className='w-[280px] rounded-md uppercase'
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd/MM/yyyy"
                            ref={datePickerRef}
                        />
                    </div>


                    <div>
                        <label htmlFor="ups">Tray Capacity</label>
                        <motion.input
                            initial={{ scale: 0.8 }}
                            animate={{
                                rotate: 0,
                                scale: 0.9,
                                transition: { duration: 0.3 }
                            }}
                            whileFocus={{
                                scale: 1
                            }}
                            {...register('ups', { required: true })} className="w-full border-gray-500 focus:ring-purple-600"
                            type="number"
                            id="ups" />
                        {errors.ups && <p className="text-red-500">This field is required</p>}
                    </div>
                    {
                        Array.from({ length: inputCount }).map((_, index) => (
                            <div key={index}>
                                <label htmlFor={`size${index + 1}`}>Size {index + 1}</label>
                                <motion.input
                                    initial={{ scale: 0.8 }}
                                    animate={{
                                        rotate: 0,
                                        scale: 0.9,
                                        transition: { duration: 0.3 }
                                    }}
                                    whileFocus={{
                                        scale: 1,
                                        shadow: "0 0 0 2px #000000"
                                    }}
                                    {...register(`size${index + 1}`)}
                                    className="w-full border-gray-500 focus:ring-purple-600"
                                    type="number"
                                    id={`size${index + 1}`}
                                    onFocus={() => handleFocus(index)}
                                />
                            </div>
                        ))
                    }
                </div>
                <motion.button
                    initial={{ scale: 0.9 }}
                    animate={{
                        rotate: 0,
                        scale: 1,
                        transition: { duration: 0.2 }
                    }}
                    whileHover={{
                        scale: 1.1
                    }}
                    whileTap={{
                        scale: 0.9
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 float-right py-2 px-4 rounded"
                    type="submit"
                >
                    Calculate
                </motion.button>
            </form>
            <AnimatePresence>
                {result && (
                    <motion.div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div className="bg-white p-4 rounded shadow-lg w-[300px]"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                        >
                            <h5>Impression: {result.impression}</h5>
                            <h2>Total Capacity: {result.capacity}</h2>
                            <h3>Total Quantity: {result.qty}</h3>
                            <h4 className="grid grid-cols-4">Sizes: {result?.sizes?.map((s, i) => <span className="mx-1" key={i}>{s}</span>)}</h4>
                            <h4 className="grid grid-cols-5">Ups: {result?.stickerDistribution?.map((s, i) => <span className="mx-1" key={i}>{s}</span>)}</h4>
                            <motion.button
                                initial={{ scale: 0.9 }}
                                animate={{
                                    rotate: 0,
                                    scale: 1,
                                    transition: {
                                        duration: 0.2
                                    }
                                }}
                                whileHover={{
                                    scale: 1.1
                                }}
                                whileTap={{
                                    scale: 0.9
                                }}
                                onClick={handlePostData}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 float-right py-2 px-4 mx-4 rounded"
                                type="submit">
                                {isLoading ? "Saving..." : "Save"}</motion.button>
                            <motion.button
                                initial={{ scale: 0.9 }}
                                animate={{
                                    rotate: 0,
                                    scale: 1,
                                    transition: {
                                        duration: 0.2
                                    }
                                }}
                                whileHover={{
                                    scale: 1.1
                                }}
                                whileTap={{
                                    scale: 0.9
                                }}
                                onClick={() => setResult(null)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 float-right py-2 px-4 rounded"
                                type="submit">
                                Close</motion.button>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CalculatePalette;