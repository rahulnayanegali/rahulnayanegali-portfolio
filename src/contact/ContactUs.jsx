import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { useForm } from 'react-hook-form';

export default function ContactUs() {
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [progress, setProgress] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleProgress = React.useCallback(() => {
    setProgress(!progress);
  }, []);

  const handleSuccess = React.useCallback(() => {
    setSuccess(!success);
    handleProgress();
  }, []);

  const handleFailure = React.useCallback(() => {
    setFailure(!failure);
    handleProgress();
  }, []);

  function sendEmail(data) {
    handleProgress();
    emailjs
      .send(
        'default_service',
        'template_go19blh',
        data,
        'user_FqD3kBuBBPP1Mm1HYrgXD',
      )
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          handleSuccess();
        },
        (error) => {
          console.log('FAILED', error);
          handleFailure();
        },
      );
    reset();
  }

  return (
    <form
      className="w-full max-w-lg mb-4 px-6 py-4 shadow-lg"
      onSubmit={handleSubmit(sendEmail)}
    >
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs
             font-bold mb-2"
            htmlFor="grid-first-name"
          >
            Full Name
            <input
              {...register("name", { required: 'Name Required' })}
              className="appearance-none block w-full bg-gray-200 text-gray-700
              border border-gray-200 rounded py-3 px-4 mb-3 leading-tight
              focus:outline-none focus:bg-white"
              id="grid-first-name"
              type="text"
              placeholder="Full Name"
            />
          </label>
          {errors.name && (
            <p className="text-red-500 text-xs italic">{errors.name.message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label
            htmlFor="email"
            className="block uppercase tracking-wide text-gray-700
            text-xs font-bold mb-2"
          >
            E-mail
            <input
              {...register("email", { required: 'Email Required' })}
              className="appearance-none block w-full bg-gray-200 text-gray-700
              border border-gray-200 rounded py-3 px-4 mb-3
              leading-tight focus:outline-none focus:bg-white
              focus:border-gray-500"
              id="email"
              type="email"
              placeholder="rahulan@company.io"
            />
          </label>
          {errors.email && (
            <p className="text-red-500 text-xs italic">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label
            className="block uppercase tracking-wide text-gray-700
             text-xs font-bold mb-2"
            htmlFor="message"
          >
            Message
            <textarea
              {...register("message", { required: 'Message Required' })}
              className=" no-resize appearance-none block w-full bg-gray-200
              text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3
              leading-tight focus:outline-none focus:bg-white
              focus:border-gray-500 h-48 resize-none"
              id="message"
            />
          </label>
          {errors.message && (
            <p className="text-red-500 text-xs italic">
              {errors.message.message}
            </p>
          )}
          {success && (
            <p className="text-green-500 text-xs italic">
              <span className="font-bold">Thank you!</span>
              <br />
              Your message has been successfully sent. I will contact you very
              soon!
            </p>
          )}
          {failure && (
            <p className="text-red-500 text-xs italic">
              Something went wrong, please try again.
            </p>
          )}
        </div>
      </div>
      <div className="md:flex md:items-center">
        <div className="md:w-1/3">
          <button
            disabled={progress}
            className={`shadow ${
              progress ? 'bg-gray-400' : 'bg-gray-700'
            }  focus:shadow-outline focus:outline-none text-white font-bold
             py-2 px-4 rounded`}
            type="submit"
          >
            Send Message
          </button>
        </div>
        <div className="md:w-2/3" />
      </div>
    </form>
  );
}
