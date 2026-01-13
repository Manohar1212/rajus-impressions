'use client';

import { useRouter } from 'next/navigation';
import { parseHelpers } from '@/lib/parse';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
  username?: string;
}

export function AdminHeader({ username = 'Admin' }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await parseHelpers.logout();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur-sm px-6">
      <div className="flex items-center gap-4 lg:pl-0 pl-12">
        <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/" target="_blank">
          <Button variant="outline" size="sm" className="gap-2 rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/30">
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">View Site</span>
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-primary/10">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-xl" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{username}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Administrator
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="gap-2 text-red-600 cursor-pointer rounded-lg focus:bg-red-50 focus:text-red-600">
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
