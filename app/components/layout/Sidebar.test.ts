import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Sidebar from './Sidebar.vue'

// Mock the store
const mockToggleDarkMode = vi.fn()
const mockStore = {
    isDarkMode: true,
    lastUpdated: new Date('2023-01-01T00:00:00Z'),
    toggleDarkMode: mockToggleDarkMode
}

vi.mock('~/stores/useCovidStore', () => ({
    useCovidStore: () => mockStore
}))

const NuxtLinkStub = {
    name: 'NuxtLink',
    props: ['to'],
    template: '<a :href="JSON.stringify(to)"><slot /></a>'
}

describe('Sidebar', () => {
    it('renders navigation links correctly', () => {
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    NuxtLink: NuxtLinkStub
                }
            }
        })

        // Check for all required links
        const links = wrapper.findAllComponents(NuxtLinkStub)

        // Debug info
        // console.log('Found links:', links.map(l => l.props('to')))

        const expectedPaths = [
            '/',
            '/countries',
            '/continents',
            '/vaccines',
            '/states'
        ]

        expectedPaths.forEach(path => {
            const link = links.find(l => l.props('to') === path)
            expect(link?.exists(), `Link for ${path} not found. Found: ${links.map(l => JSON.stringify(l.props('to'))).join(', ')}`).toBe(true)
        })

        // Check Local Discovery link specifically for query params
        const localDiscoveryLink = links.find(l => {
            const to = l.props('to')
            return typeof to === 'object' && to.path === '/local-discovery'
        })

        expect(localDiscoveryLink?.exists(), 'Local Discovery link not found').toBe(true)
        expect(localDiscoveryLink?.props('to').query).toEqual({
            persist_gl: '1',
            gl: 'TH'
        })
    })

    it('theme toggle works', async () => {
        mockStore.isDarkMode = true
        const wrapper = mount(Sidebar, {
            global: {
                stubs: {
                    NuxtLink: true
                }
            }
        })

        const button = wrapper.find('button')
        expect(button.text()).toContain('Light Mode')

        await button.trigger('click')
        expect(mockToggleDarkMode).toHaveBeenCalled()
    })
})
