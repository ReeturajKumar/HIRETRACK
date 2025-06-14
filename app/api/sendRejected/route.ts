import { compileSendRejectedTemplate, sendMail } from "@/lib/mail"
import { NextResponse } from "next/server"

export const POST = async(req:Request) => {
  const {email,fullName} = await req.json()

  const responce = await sendMail({
    to:email,
    name:fullName,
    subject:"Sorry! You have been rejected for the next round",
    body:compileSendRejectedTemplate(fullName)
  })

  if(responce?.messageId){
    return NextResponse.json("Mail sent successfully",{status:200})
  }else{
    return NextResponse.json("Mail not sent",{status:500})
  }
}