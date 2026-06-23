function Fix-File {
    param([string]$FilePath, [scriptblock]$Replacements)
    $content = Get-Content $FilePath -Raw
    $newContent = & $Replacements $content
    if ($content -ne $newContent) {
        Set-Content -Path $FilePath -Value $newContent -NoNewline
        Write-Host "Fixed $FilePath"
    }
}

Fix-File -FilePath "src/components/Contact.tsx" -Replacements {
    param($c)
    $c = $c -replace 'import \{ useState, FormEvent \} from "react";', "import { useState } from "react";
import type { FormEvent } from "react";"
    $c = $c -replace 'import \{ motion, AnimatePresence \} from "motion/react";', 'import { motion, AnimatePresence } from "framer-motion";'
    return $c
}

Fix-File -FilePath "src/components/Hero.tsx" -Replacements {
    param($c)
    $c = $c -replace 'import \{ MouseEvent, useState, useEffect \} from "react";', "import { useState, useEffect } from "react";
import type { MouseEvent } from "react";"
    $c = $c -replace 'import \{ motion, AnimatePresence \} from "motion/react";', 'import { motion, AnimatePresence } from "framer-motion";'
    $c = $c -replace 'type: "spring"', 'type: "spring" as const'
    return $c
}

Fix-File -FilePath "src/components/Navbar.tsx" -Replacements {
    param($c)
    $c = $c -replace 'import \{ useState, useEffect, MouseEvent \} from "react";', "import { useState, useEffect } from "react";
import type { MouseEvent } from "react";"
    $c = $c -replace 'import \{ motion, AnimatePresence \} from "motion/react";', 'import { motion, AnimatePresence } from "framer-motion";'
    return $c
}

Fix-File -FilePath "src/components/Projects.tsx" -Replacements {
    param($c)
    $c = $c -replace 'import \{ useState, useRef, useEffect, MouseEvent \} from "react";', "import { useState, useRef, useEffect } from "react";
import type { MouseEvent } from "react";"
    $c = $c -replace 'import \{ Project \} from "\.\./types";', 'import type { Project } from "../types";'
    $c = $c -replace 'import \{ motion, useScroll, useTransform, useSpring, AnimatePresence \} from "motion/react";', 'import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";'
    $c = $c -replace '\(op\) => op > 0\.75 \? "auto" : "none"', '(op: number) => op > 0.75 ? "auto" : "none"'
    $c = $c -replace 'ExternalLink,\s*', ''
    $c = $c -replace 'Sparkles,\s*', ''
    $c = $c -replace 'Layers,\s*', ''
    $c = $c -replace 'ShieldCheck,\s*', ''
    $c = $c -replace 'Workflow,\s*', ''
    $c = $c -replace 'Compass,\s*', ''
    $c = $c -replace 'Layout,\s*', ''
    $c = $c -replace 'Sliders,\s*', ''
    $c = $c -replace 'FileCheck2,\s*', ''
    return $c
}

Fix-File -FilePath "src/components/Skills.tsx" -Replacements {
    param($c)
    $c = $c -replace 'import \{ useState, useEffect, useRef, MouseEvent \} from "react";', "import { useState, useEffect, useRef } from "react";
import type { MouseEvent } from "react";"
    $c = $c -replace 'import \{ SkillCategory, SkillItem \} from "\.\./types";', 'import type { SkillCategory, SkillItem } from "../types";'
    $c = $c -replace 'import \{ motion, AnimatePresence \} from "motion/react";', 'import { motion, AnimatePresence } from "framer-motion";'
    $c = $c -replace 'RotateCcw\s*', ''
    return $c
}

Fix-File -FilePath "src/components/Timeline.tsx" -Replacements {
    param($c)
    $c = $c -replace 'import \{ HackathonEntry \} from "\.\./types";', 'import type { HackathonEntry } from "../types";'
    $c = $c -replace 'import \{ motion \} from "motion/react";', 'import { motion } from "framer-motion";'
    $c = $c -replace 'MapPin,\s*', ''
    $c = $c -replace 'type: "spring"', 'type: "spring" as const'
    return $c
}
