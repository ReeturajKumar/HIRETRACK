/* eslint-disable @typescript-eslint/no-unused-vars */
import nodemailer from "nodemailer"
import handlebars from "handlebars"
import toast from "react-hot-toast";
import { ThankYouTemplate } from "./designs/thank-you";
import { sendRejectedEmail } from "./designs/send-rejection";
import { sendSelectedEmail } from "./designs/send-selected";

export const sendMail = async({to,name,subject,body}:{
  to:string,
  name:string,
  subject:string,
  body:string
}) => {
  const {SMTP_PASSWORD,SMTP_EMAIL} = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth:{
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD
    }
  })

  try {
    const textResult = await transport.verify();
    console.log(textResult);
  } catch (error) {
    console.log(error)
    toast.error("Something went wrong");
    return
  }

  try {
    const sendResult = await transport.sendMail({
      from:SMTP_EMAIL,
      to,
      subject,
      html:body
    })
    return sendResult
  } catch (error) {
    console.log(error)
    toast.error("Something went wrong");
    return
  }
}


export const compileThankYouEmailTemplate = (name: string) => {
  const template = handlebars.compile(ThankYouTemplate)

  const htmlBody = template({name})
  return htmlBody
}



export const compileSendSelctedTemplate = (name: string) => {
  const template = handlebars.compile(sendSelectedEmail)

  const htmlBody = template({name})
  return htmlBody
}


export const compileSendRejectedTemplate = (name: string) => {
  const template = handlebars.compile(sendRejectedEmail)

  const htmlBody = template({name})
  return htmlBody
}