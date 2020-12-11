import React, { useEffect, useState } from 'react'

function StatusIcon({ status }) {
    return (
        <div className="h-4 w-4 absolute inset-0 left-4 my-auto">
            {/*status === 'ok' && (
                <div className="animate-ping absolute h-full w-full inset-0 m-auto rounded-full transition-all bg-green-400 opacity-75"></div>
            )*/}
            <div
                className={`rounded-full h-3 w-3 absolute inset-0 m-auto transition-all ${
                    {
                        pending: 'bg-current opacity-50',
                        ok: 'bg-green-500',
                        error: 'bg-red-500 animate-pulse',
                    }[status]
                }`}
            ></div>
        </div>
    )
}

export default function Tab({ href, name, check, onClick, selected, color }) {
    const [status, setStatus] = useState('pending')

    useEffect(() => {
        function checkStatus() {
            fetch('check.php?url=' + encodeURIComponent(check || href))
                .then((response) => {
                    response
                        .json()
                        .then((status) =>
                            setStatus(status === '200' ? 'ok' : 'error')
                        )
                })
                .catch(() => {
                    setStatus('error')
                })
        }
        checkStatus()
        const interval = setInterval(checkStatus, 60000)
        return () => clearInterval(interval)
    }, [href])

    return (
        <div
            className="cursor-pointer group p-2 pl-12 pr-6 border-b-4 bg-gray-50 dark:bg-gray-900 relative hover:bg-gray-200 dark:hover:bg-gray-700"
            style={{
                borderBottomColor: selected ? color : 'transparent',
            }}
            onClick={onClick}
        >
            <StatusIcon status={status} />
            {name}
        </div>
    )
}
