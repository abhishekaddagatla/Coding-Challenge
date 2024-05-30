import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

interface ToggleThemeIconProps {
    theme: any;
}

const ToggleThemeIcon: React.FC<ToggleThemeIconProps> = ({ theme }: ToggleThemeIconProps) => {
    if (theme.palette.mode === 'dark') {
        return (
            <LightModeIcon />
        );
    } else {
        return (
            <DarkModeIcon />
        );
    }
};

export default ToggleThemeIcon;