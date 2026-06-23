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
    $c = $c -replace 'Github,\s*Linkedin,\s*', ''
    $c = $c -replace 'import \{ Send, Mail', "import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Send, Mail"
    $c = $c -replace 'icon: Github,', 'icon: FaGithub,'
    $c = $c -replace 'icon: Linkedin,', 'icon: FaLinkedin,'
    return $c
}

Fix-File -FilePath "src/components/Navbar.tsx" -Replacements {
    param($c)
    $c = $c -replace '<Github', '<FaGithub'
    $c = $c -replace '<Linkedin', '<FaLinkedin'
    $c = $c -replace 'import \{ Menu, X \} from "lucide-react";', "import { Menu, X } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";"
    return $c
}

Fix-File -FilePath "src/components/Projects.tsx" -Replacements {
    param($c)
    $c = $c -replace 'Github,\s*', ''
    $c = $c -replace 'ExternalLink,\s*', ''
    $c = $c -replace 'Sparkles,\s*', ''
    $c = $c -replace 'Layers,\s*', ''
    $c = $c -replace 'ShieldCheck,\s*', ''
    $c = $c -replace 'Workflow,\s*', ''
    $c = $c -replace 'Compass,\s*', ''
    $c = $c -replace 'Layout,\s*', ''
    $c = $c -replace 'Sliders,\s*', ''
    $c = $c -replace 'FileCheck2,\s*', ''
    $c = $c -replace '<Github', '<FaGithub'
    $c = $c -replace 'import \{ motion', "import { FaGithub } from "react-icons/fa";
import { motion"
    return $c
}

Fix-File -FilePath "src/components/Hero.tsx" -Replacements {
    param($c)
    $c = $c -replace 'import \{ useState, useEffect \} from "react";\n', ""
    $c = $c -replace 'import type \{ MouseEvent \} from "react";\n', ""
    $c = $c -replace 'import \{ motion, AnimatePresence \}', 'import { motion }'
    return $c
}

Fix-File -FilePath "src/components/Skills.tsx" -Replacements {
    param($c)
    $c = $c -replace 'RotateCcw,\s*', ''
    $c = $c -replace 'Globe,\s*', ''
    $c = $c -replace 'Database\s*', ''
    return $c
}

