
import sys

file_path = r'd:\studlyf\frontend\components\institution\PostOpportunityModal.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the College Restriction marker
start_marker = "{/* College Restriction */}"
start_index = -1
for i, line in enumerate(lines):
    if start_marker in line:
        start_index = i
        break

# Find the Gender Restriction marker
end_marker = "{/* Gender Restriction */}"
end_index = -1
for i, line in enumerate(lines):
    if end_marker in line:
        end_index = i
        break

if start_index == -1 or end_index == -1:
    print(f"Markers not found: start={start_index}, end={end_index}")
    sys.exit(1)

# Precisely reconstruct the College Restriction block
new_block = [
    '                                                    {/* College Restriction */}\n',
    '                                                    <div className={`p-8 bg-slate-50 rounded-[1.5rem] border transition-all ${showCollegeFilter ? "border-[#6C3BFF] bg-white shadow-xl shadow-purple-50" : "border-slate-100"}`}>\n',
    '                                                        <div className="flex items-center justify-between mb-6">\n',
    '                                                            <div className="flex items-center gap-4">\n',
    '                                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#6C3BFF]">🏢</div>\n',
    '                                                                <div>\n',
    '                                                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">College/Organization</p>\n',
    '                                                                    <p className="text-[10px] text-slate-400 font-medium">Restrict applicants by college/organization</p>\n',
    '                                                                </div>\n',
    '                                                            </div>\n',
    '                                                            <div className="flex items-center gap-3">\n',
    '                                                                <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-all"><RefreshCw size={14} /></button>\n',
    '                                                                {showCollegeFilter ? (\n',
    '                                                                    <button onClick={() => setShowCollegeFilter(false)} className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">✕ Cancel</button>\n',
    '                                                                ) : (\n',
    '                                                                    <button onClick={() => setShowCollegeFilter(true)} className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-[#6C3BFF] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">🖊️ Change</button>\n',
    '                                                                )}\n',
    '                                                            </div>\n',
    '                                                        </div>\n',
    '\n',
    '                                                        {showCollegeFilter && (\n',
    '                                                            <div className="animate-in slide-in-from-top-4 duration-300">\n',
    '                                                                <div className="flex gap-3 mb-6">\n',
    '                                                                    <button \n',
    '                                                                        onClick={() => toggleOrganizationRestriction("all")}\n',
    '                                                                        className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase transition-all ${\n',
    '                                                                            formData.eligibleOrganizations.includes("Allow All") \n',
    '                                                                            ? "bg-white border-2 border-[#6C3BFF] text-[#6C3BFF]" \n',
    '                                                                            : "bg-white border-2 border-dashed border-slate-200 text-slate-400"\n',
    '                                                                        }`}\n',
    '                                                                    >\n',
    '                                                                        Allow All\n',
    '                                                                    </button>\n',
    '                                                                    <button \n',
    '                                                                        onClick={() => toggleOrganizationRestriction("specific")}\n',
    '                                                                        className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase transition-all ${\n',
    '                                                                            !formData.eligibleOrganizations.includes("Allow All") \n',
    '                                                                            ? "bg-white border-2 border-[#6C3BFF] text-[#6C3BFF]" \n',
    '                                                                            : "bg-white border-2 border-dashed border-slate-200 text-slate-400"\n',
    '                                                                        }`}\n',
    '                                                                    >\n',
    '                                                                        Eligible College/Organization(s)\n',
    '                                                                    </button>\n',
    '                                                                </div>\n',
    '\n',
    '                                                                {!formData.eligibleOrganizations.includes("Allow All") && (\n',
    '                                                                    <div className="mb-6 space-y-4 animate-in fade-in duration-300">\n',
    '                                                                        <div className="flex gap-3">\n',
    '                                                                            <input \n',
    '                                                                                type="text" \n',
    '                                                                                placeholder="Type college/organization name and press enter"\n',
    '                                                                                onKeyDown={(e) => {\n',
    '                                                                                    if (e.key === "Enter") {\n',
    '                                                                                        e.preventDefault();\n',
    '                                                                                        addOrganization(e.currentTarget.value);\n',
    '                                                                                        e.currentTarget.value = "";\n',
    '                                                                                    }\n',
    '                                                                                }}\n',
    '                                                                                className="flex-1 px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#6C3BFF]/20 outline-none text-sm font-medium"\n',
    '                                                                            />\n',
    '                                                                        </div>\n',
    '                                                                        <div className="flex flex-wrap gap-2">\n',
    '                                                                            {formData.eligibleOrganizations.map(org => (\n',
    '                                                                                <span key={org} className="px-4 py-2 bg-[#6C3BFF]/10 text-[#6C3BFF] rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">\n',
    '                                                                                    {org}\n',
    '                                                                                    <button onClick={() => setFormData({...formData, eligibleOrganizations: formData.eligibleOrganizations.filter(o => o !== org)})} className="hover:text-red-500">✕</button>\n',
    '                                                                                </span>\n',
    '                                                                            ))}\n',
    '                                                                        </div>\n',
    '                                                                    </div>\n',
    '                                                                )}\n',
    '\n',
    '                                                                <div className="pt-6 border-t border-slate-50">\n',
    '                                                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4">Team composition by organization</p>\n',
    '                                                                    <label className="flex items-center gap-3 cursor-pointer group">\n',
    '                                                                        <input \n',
    '                                                                            type="checkbox" \n',
    '                                                                            checked={formData.sameOrgTeam}\n',
    '                                                                            onChange={(e) => setFormData({...formData, sameOrgTeam: e.target.checked})}\n',
    '                                                                            className="w-5 h-5 rounded-md border-slate-300 text-[#6C3BFF] focus:ring-[#6C3BFF]" \n',
    '                                                                        />\n',
    '                                                                        <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-all">Member of a team should be from same organizations.</span>\n',
    '                                                                    </label>\n',
    '                                                                </div>\n',
    '                                                            </div>\n',
    '                                                        )}\n',
    '                                                    </div>\n',
    '\n'
]

final_lines = lines[:start_index] + new_block + lines[end_index:]
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(final_lines)

print("Successfully restored and enhanced organization restriction section.")
