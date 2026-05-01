
import sys

file_path = r'd:\studlyf\frontend\components\institution\PostOpportunityModal.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# We want to replace the block from where "Other platform" ends to the footer start.
# Looking at the previous view_file:
# 864: Redirect candidates to an external website.
# ... closures ...
# 874: <div className="p-8 border-t ...

start_index = -1
end_index = -1

for i, line in enumerate(lines):
    if "Redirect candidates to an external website." in line:
        start_index = i
    if 'className="p-8 border-t border-slate-100 bg-white flex items-center justify-end gap-4 shrink-0"' in line:
        end_index = i
        break

if start_index != -1 and end_index != -1:
    # Construct the correct closing sequence
    new_block = [
        '                                                            <p className="text-xs text-slate-300 font-medium mt-1">Redirect candidates to an external website.</p>\n',
        '                                                        </div>\n',
        '                                                    </div>\n',
        '                                                </div>\n',
        '                                            </div>\n',
        '                                        </div>\n',
        '                                    </div>\n',
        '                            )}\n',
        '                        </div>\n',
        '                    </div>\n',
        '\n'
    ]
    
    # lines[start_index] is the "Redirect..." line.
    # We replace from start_index to end_index (not inclusive of end_index)
    lines[start_index:end_index] = new_block
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f"Successfully fixed {file_path}")
else:
    print(f"Could not find indices: start={start_index}, end={end_index}")
