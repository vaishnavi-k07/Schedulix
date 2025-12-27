/**
 * Dashboard module for Schedulix
 */

export const dashboard = {
    render(app) {
        const main = document.getElementById('mainContent');
        const stats = app.state.stats;

        const statCards = [
            { name: 'Subjects', value: stats.total_subjects || 0, icon: '📘', color: 'blue' },
            { name: 'Faculty', value: stats.total_teachers || 0, icon: '👩‍🏫', color: 'green' },
            { name: 'Classrooms', value: stats.total_classrooms || 0, icon: '🏫', color: 'purple' },
            { name: 'Time Slots', value: stats.total_time_slots || 0, icon: '⏱', color: 'orange' }
        ];

        main.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>
                <p class="text-gray-600">Welcome to Schedulix Automatic Timetable Generator</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                ${statCards.map(stat => `
                    <div class="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">${stat.name}</p>
                                <p class="text-3xl font-bold text-gray-800 mt-1">${stat.value}</p>
                            </div>
                            <div class="w-12 h-12 bg-${stat.color}-50 rounded-lg flex items-center justify-center text-2xl">
                                ${stat.icon}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span>🚀</span> Quick Start Guide
                    </h3>
                    <div class="space-y-4">
                        <div class="flex gap-3">
                            <div class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                            <p class="text-gray-600 text-sm">Add <a href="#/subjects" class="text-blue-600 hover:underline">Subjects</a> that need to be scheduled.</p>
                        </div>
                        <div class="flex gap-3">
                            <div class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                            <p class="text-gray-600 text-sm">Register <a href="#/teachers" class="text-blue-600 hover:underline">Faculty</a> and assign their subjects.</p>
                        </div>
                        <div class="flex gap-3">
                            <div class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                            <p class="text-gray-600 text-sm">Define <a href="#/classrooms" class="text-blue-600 hover:underline">Classrooms</a> and their types.</p>
                        </div>
                        <div class="flex gap-3">
                            <div class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                            <p class="text-gray-600 text-sm">Set up <a href="#/timeslots" class="text-blue-600 hover:underline">Time Slots</a> including breaks.</p>
                        </div>
                        <div class="flex gap-3">
                            <div class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">5</div>
                            <p class="text-gray-600 text-sm">Go to <a href="#/timetable" class="text-blue-600 hover:underline">Generate</a> to create your timetable.</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span>🗓</span> Recent Timetables
                    </h3>
                    ${app.state.timetables.length > 0 ? `
                        <div class="space-y-3">
                            ${app.state.timetables.slice(0, 5).map(tt => `
                                <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all">
                                    <div class="flex items-center gap-3">
                                        <div class="w-2 h-2 rounded-full ${tt.is_active ? 'bg-green-500' : 'bg-gray-300'}"></div>
                                        <span class="font-medium text-gray-700">${tt.name}</span>
                                    </div>
                                    <span class="text-xs text-gray-400">${new Date(tt.created_at).toLocaleDateString()}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="mt-4 text-center">
                            <a href="#/timetable" class="text-blue-600 text-sm font-medium hover:underline">View all timetables</a>
                        </div>
                    ` : `
                        <div class="text-center py-10">
                            <p class="text-gray-400 text-sm italic">No timetables generated yet.</p>
                            <button onclick="location.hash='#/timetable'" class="mt-4 text-blue-600 text-sm font-medium hover:underline">+ Generate First Timetable</button>
                        </div>
                    `}
                </div>
            </div>

            <div class="mt-8 flex gap-4">
                <button onclick="location.hash='#/timetable'" class="flex-1 bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 font-semibold shadow-lg shadow-blue-200 transition-all active:transform active:scale-95">
                    Generate New Timetable
                </button>
                <button id="refreshDashboardBtn" class="bg-gray-100 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-200 font-semibold transition-all">
                    Refresh Stats
                </button>
            </div>
        `;

        document.getElementById('refreshDashboardBtn').onclick = () => app.refreshData();
    }
};
