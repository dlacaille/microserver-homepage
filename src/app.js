import React, { useEffect, useMemo, useState } from 'react'
import { render } from 'react-dom'
import yaml from 'js-yaml'
import classNames from 'clsx'
import Tab from './components/Tab'
import LightBulb from './svg/lightbulb-solid'

import 'tailwindcss/tailwind.css'
import './style.css'
import useLocalStorage from './utils/useLocalStorage'

function siteWithName(sites, name) {
    if (!sites) return undefined
    const lowerName = name.toLowerCase()
    return sites.find((site) => site.name.toLowerCase() === lowerName)
}

function hashSite(sites) {
    if (!sites) return undefined
    const hash = location.hash.substr(1) || ''
    const name = hash.toLowerCase()
    return siteWithName(sites, name) || sites[0]
}

function App() {
    const [isDark, setIsDark] = useLocalStorage('isDark', true)
    const [config, setConfig] = useState({ sites: [] })
    const [selected, setSelected] = useState()

    function onChangeTab(site) {
        const { name } = site
        setSelected(site)
        history.replaceState({}, name, '#' + name.toLowerCase())
    }

    useEffect(() => {
        fetch('config.yml').then((response) => {
            response.text().then((yml) => {
                const loadedConfig = yaml.safeLoad(yml)
                setConfig(loadedConfig)
                setSelected(hashSite(loadedConfig.sites))
            })
        })
    }, [])

    return (
        <div className={`${isDark ? 'dark' : ''} w-full h-full`}>
            <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-black text-gray-700 dark:text-gray-300">
                <div className="bg-white dark:bg-gray-900 flex flex-row items-stretch shadow-md divide-x divide-gray-200 dark:divide-gray-600">
                    {config.sites.map((site) => (
                        <Tab
                            selected={site === selected}
                            key={site.name}
                            name={site.name}
                            href={site.url}
                            color={site.color}
                            check={site.ping || site.url}
                            onClick={(e) => {
                                e.preventDefault()
                                onChangeTab(site)
                            }}
                        />
                    ))}
                    <div className="flex-1" />
                    <div
                        className="cursor-pointer flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 px-4"
                        onClick={() => setIsDark((b) => !b)}
                    >
                        <LightBulb className="h-5" />
                    </div>
                </div>
                {config.sites.map((site) => (
                    <iframe
                        className={classNames(
                            'flex-1',
                            selected !== site && 'hidden'
                        )}
                        src={site.url}
                    />
                ))}
            </div>
        </div>
    )
}

render(<App />, document.body)

if (module.hot) {
    module.hot.accept()
}
