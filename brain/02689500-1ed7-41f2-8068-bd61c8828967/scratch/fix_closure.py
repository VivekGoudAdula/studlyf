
import sys

file_path = r'd:\studlyf\frontend\components\institution\PostOpportunityModal.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# We want to remove the extra </div> that is closing the main content wrapper too early.
# It should be after line 871 (which is ")}") and before line 875 (which starts "<div className='p-8...")

# Current state:
# 871: )}
# 872: </div> (closes 237/236?)
# 873: </div> (closes 232? THIS IS THE EXTRA ONE)

# Let's find the indices.
target_line_871 = -1
for i, line in enumerate(lines):
    if ")} " in line or ")}" in line.strip():
        if i > 800: # Make sure we are in the right area
            target_line_871 = i
            break

if target_line_871 != -1:
    print(f"Found )}} at line {target_line_871 + 1}")
    # Remove one </div> between 871 and the footer.
    
    # Let's look at the next few lines.
    for j in range(target_line_871 + 1, target_line_871 + 10):
        if "</div>" in lines[j]:
            print(f"Removing extra </div> at line {j + 1}")
            lines.pop(j)
            break

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Successfully removed extra closure.")
else:
    print("Could not find )}")
