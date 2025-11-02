import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Nav, Row, Tab } from 'react-bootstrap'
import ContentLoader from 'react-content-loader'

export interface NavItem {
	label: string
	id: string
	tab?: JSX.Element
	permission?: () => boolean | undefined
	content: any
}

export interface Props {
	defaultActiveKey: string
	nav: NavItem[]
	defaultPinnedTabs?: string[]
	title?: string
	loading?: boolean
	navLinkContainerProps?: any
	navContentContainerProps?: any
	onTitleEdit?: () => void
	pinnedTabsStorageKey?: string
}

export default function TabLayout({
	defaultActiveKey,
	nav,
	defaultPinnedTabs,
	title,
	loading,
	navLinkContainerProps,
	navContentContainerProps,
	onTitleEdit,
	pinnedTabsStorageKey,
}: Props) {
	// Enable persistence if storage key is provided
	const persistPinnedTabs = !!pinnedTabsStorageKey

	// Initialize pinnedTabs state - load from localStorage if persistence is enabled
	const getInitialPinnedTabs = (): boolean[] => {
		if (!persistPinnedTabs || !pinnedTabsStorageKey || typeof window === 'undefined') {
			return defaultPinnedTabs
				? nav.map((x) => defaultPinnedTabs?.includes(x.id))
				: new Array(nav.length).fill(false)
		}

		try {
			const stored = localStorage.getItem(pinnedTabsStorageKey)
			if (stored) {
				const storedPinnedIds = JSON.parse(stored) as string[]
				if (Array.isArray(storedPinnedIds)) {
					const loadedPinnedTabs = nav.map((x) => storedPinnedIds.includes(x.id))
					// Ensure array length matches
					while (loadedPinnedTabs.length < nav.length) {
						loadedPinnedTabs.push(false)
					}
					return loadedPinnedTabs.slice(0, nav.length)
				}
			}
		} catch (e) {
			console.warn('Failed to load pinned tabs from localStorage', e)
		}

		return defaultPinnedTabs ? nav.map((x) => defaultPinnedTabs?.includes(x.id)) : new Array(nav.length).fill(false)
	}

	const [pinnedTabs, setPinnedTabs] = useState<boolean[]>(getInitialPinnedTabs)
	const [showAll, setShowAll] = useState<boolean>()
	const [currentTab, setCurrentTab] = useState<string>(defaultActiveKey)
	const isInitialMount = useRef(true)
	const pinnedTabsRef = useRef<boolean[]>(getInitialPinnedTabs())

	// Keep ref in sync with state
	useEffect(() => {
		pinnedTabsRef.current = pinnedTabs
	}, [pinnedTabs])

	// Helper function to save pinned tabs to localStorage immediately
	const savePinnedTabsToStorage = (tabs: boolean[]) => {
		if (!persistPinnedTabs || !pinnedTabsStorageKey || typeof window === 'undefined') return

		try {
			// Ensure tabs array matches nav length before saving
			const safeTabs =
				tabs.length === nav.length
					? tabs
					: [...tabs]
							.concat(new Array(Math.max(0, nav.length - tabs.length)).fill(false))
							.slice(0, nav.length)

			// Build the pinned IDs array by iterating through all nav items
			const pinnedIds: string[] = []
			for (let i = 0; i < nav.length; i++) {
				if (safeTabs[i] && nav[i]) {
					pinnedIds.push(nav[i].id)
				}
			}

			localStorage.setItem(pinnedTabsStorageKey, JSON.stringify(pinnedIds))
		} catch (e) {
			console.warn('Failed to save pinned tabs to localStorage', e)
		}
	}

	// Reload pinned tabs from localStorage when nav structure changes (if persistence is enabled)
	useEffect(() => {
		// Skip on initial mount since we already loaded in useState
		if (isInitialMount.current) {
			isInitialMount.current = false
			return
		}

		if (!persistPinnedTabs || !pinnedTabsStorageKey || typeof window === 'undefined') {
			// If persistence disabled, reset to defaults when nav changes
			if (pinnedTabs.length !== nav.length) {
				const initialPinnedTabs = defaultPinnedTabs
					? nav.map((x) => defaultPinnedTabs?.includes(x.id))
					: new Array(nav.length).fill(false)
				setPinnedTabs(initialPinnedTabs)
			}
			return
		}

		try {
			const stored = localStorage.getItem(pinnedTabsStorageKey)
			if (stored) {
				const storedPinnedIds = JSON.parse(stored) as string[]
				if (Array.isArray(storedPinnedIds)) {
					const loadedPinnedTabs = nav.map((x) => storedPinnedIds.includes(x.id))
					// Ensure array length matches
					while (loadedPinnedTabs.length < nav.length) {
						loadedPinnedTabs.push(false)
					}
					const finalPinnedTabs = loadedPinnedTabs.slice(0, nav.length)
					setPinnedTabs(finalPinnedTabs)
					return
				}
			}
		} catch (e) {
			console.warn('Failed to load pinned tabs from localStorage', e)
		}

		// Fallback to defaults if nothing in storage
		const initialPinnedTabs = defaultPinnedTabs
			? nav.map((x) => defaultPinnedTabs?.includes(x.id))
			: new Array(nav.length).fill(false)
		setPinnedTabs(initialPinnedTabs)
	}, [pinnedTabsStorageKey, persistPinnedTabs, defaultPinnedTabs, nav, pinnedTabs.length]) // Reload when nav structure changes

	// Ensure pinnedTabs array length always matches nav length (safety check)
	const isSyncingLength = useRef(false)
	useEffect(() => {
		if (pinnedTabs.length !== nav.length) {
			isSyncingLength.current = true
			const newPinnedTabs = [...pinnedTabs]
			// If array is shorter, pad with false
			while (newPinnedTabs.length < nav.length) {
				newPinnedTabs.push(false)
			}
			// If array is longer, trim it
			if (newPinnedTabs.length > nav.length) {
				newPinnedTabs.splice(nav.length)
			}
			setPinnedTabs(newPinnedTabs)
			// Save after syncing length to ensure persistence
			if (persistPinnedTabs && pinnedTabsStorageKey && !isInitialMount.current) {
				savePinnedTabsToStorage(newPinnedTabs)
			}
			// Reset flag after state update
			setTimeout(() => {
				isSyncingLength.current = false
			}, 0)
		}
	}, [nav.length, pinnedTabs.length])

	// Save pinned tabs to localStorage whenever they change (backup for programmatic changes)
	useEffect(() => {
		if (!persistPinnedTabs || !pinnedTabsStorageKey || typeof window === 'undefined') return
		// Skip save on initial mount since we just loaded from storage
		if (isInitialMount.current) return
		// Skip save if we're currently syncing array length to prevent saving incomplete data
		if (isSyncingLength.current) return
		// Only save if array lengths match to ensure we save complete data
		if (pinnedTabs.length !== nav.length) return

		savePinnedTabsToStorage(pinnedTabs)
	}, [pinnedTabs, persistPinnedTabs, pinnedTabsStorageKey, nav])

	// Save on page unload as a final safeguard
	useEffect(() => {
		if (!persistPinnedTabs || !pinnedTabsStorageKey || typeof window === 'undefined') return

		const handleBeforeUnload = () => {
			// Use ref to get the latest value since closure might have stale state
			savePinnedTabsToStorage(pinnedTabsRef.current)
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		// Also listen to visibilitychange for when user switches tabs/windows
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'hidden') {
				savePinnedTabsToStorage(pinnedTabsRef.current)
			}
		}
		document.addEventListener('visibilitychange', handleVisibilityChange)

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
			document.removeEventListener('visibilitychange', handleVisibilityChange)
		}
	}, [persistPinnedTabs, pinnedTabsStorageKey, nav])

	const handlePinToggle = (index: number) => {
		const copy = [...pinnedTabs]
		copy[index] = !copy[index]
		setPinnedTabs(copy)
		// Save immediately to ensure persistence before page unload
		savePinnedTabsToStorage(copy)
	}

	const handlePinToggleAll = () => {
		let newPinnedTabs: boolean[]
		if (pinnedTabs.length === nav.length && pinnedTabs.reduce((p, c) => p && c, true)) {
			newPinnedTabs = new Array(nav.length).fill(false)
		} else {
			newPinnedTabs = new Array(nav.length).fill(true)
		}
		setPinnedTabs(newPinnedTabs)
		// Save immediately to ensure persistence before page unload
		savePinnedTabsToStorage(newPinnedTabs)
	}

	const renderPin = (tabIndex: number) => (
		<FontAwesomeIcon
			icon="thumbtack"
			onClick={() => handlePinToggle(tabIndex)}
			className={pinnedTabs[tabIndex] ? 'text-warning' : 'text-light'}
			style={!pinnedTabs[tabIndex] ? { transform: 'rotate(45deg)' } : {}}
		/>
	)

	const renderTabLinks = (anchors: NavItem[]) => (
		<>
			<Nav.Item>
				<Nav.Link eventKey={'all'} onSelect={() => setShowAll(true)} className="text-white">
					<FontAwesomeIcon
						icon="thumbtack"
						onClick={handlePinToggleAll}
						className={
							pinnedTabs.length === nav.length && pinnedTabs.reduce((p, c) => p && c, true)
								? 'text-warning'
								: 'text-light'
						}
						style={
							pinnedTabs.length === nav.length && pinnedTabs.reduce((p, c) => p && c, true)
								? {}
								: { transform: 'rotate(45deg)' }
						}
					/>
					<span className="ml-4">All</span>
				</Nav.Link>
			</Nav.Item>
			{anchors.map((x, i) =>
				!x.permission || x.permission() ? (
					<Nav.Item key={`v-pills-${x.id.toLowerCase()}-tab`}>
						<Nav.Link
							eventKey={x.id.toLowerCase()}
							onSelect={async () => {
								await new Promise((r) => {
									setTimeout(r, 100)
								})
								const element = document.getElementById(`recipe-section-${x.id}`)
								if (element?.scrollIntoView) element?.scrollIntoView()
								window.scrollBy(0, -50)
								setCurrentTab(x.id)
								setShowAll(false)
							}}
							className={`text-white my-1 ${currentTab === x.id ? 'active' : ' bg-dark '}`}
						>
							{renderPin(i)}
							<span className="ml-4">{x.tab || x.label}</span>
						</Nav.Link>
					</Nav.Item>
				) : null
			)}
		</>
	)

	const renderTabContent = () => (
		<Tab.Content>
			{nav.map((n, i) => (
				<Tab.Pane
					key={`tab-nav-${n.id}`}
					eventKey={n.id}
					title={n.label}
					active={showAll || pinnedTabs[i] || undefined}
					style={{ marginBottom: 50 }}
				>
					<>
						{renderPin(i)}{' '}
						<span id={`recipe-section-${n.id}`} className={'h3'}>
							{n.label}
						</span>
					</>
					{n.content}
				</Tab.Pane>
			))}
		</Tab.Content>
	)

	const renderTabs = () => <Col>{renderTabContent()}</Col>

	const loader = (value: number | string | null, width: number = 275, height: number = 15) =>
		!loading ? (
			value
		) : (
			<ContentLoader height={height} speed={3} foregroundColor={'#333'} backgroundColor={'#999'}>
				<rect x="25" y="0" rx="5" ry="5" width={width} height={height} />
			</ContentLoader>
		)

	const defaultProps = {
		xs: 12,
		md: 4,
		lg: 3,
	}

	return (
		<Tab.Container defaultActiveKey={defaultActiveKey}>
			<Row>
				<Col {...{ ...defaultProps, ...(navLinkContainerProps || {}) }}>
					<h3 className="text-center">
						{typeof title !== 'undefined' && loader(title, 225, 25)}
						{onTitleEdit && (
							<FontAwesomeIcon
								className="text-white ml-2"
								style={{ fontSize: 22 }}
								icon="edit"
								onClick={onTitleEdit}
							/>
						)}
					</h3>
					<Nav variant="pills" className="flex-column sticky-top sticky-top-pad">
						{renderTabLinks(nav)}
					</Nav>
				</Col>
				<Col>
					<Row {...(navContentContainerProps || {})}>{renderTabs()}</Row>
				</Col>
			</Row>
		</Tab.Container>
	)
}
