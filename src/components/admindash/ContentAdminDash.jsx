import { Fragment } from "react";
import { Outlet } from "react-router-dom";


export default function ContentAdminDash() {
    return (
        <Fragment>
            <main className='w-full h-full overflow-y-auto'>
                <Outlet />
            </main>
        </Fragment>
    )
}
