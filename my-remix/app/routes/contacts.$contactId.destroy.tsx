import {ActionFunctionArgs, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {deleteContact} from "~/data";

export const action = async ({params}:ActionFunctionArgs) => {

    invariant(params.contactId, "Missing ContactId Params")

    await deleteContact(params.contactId)
    return redirect("/")


}