let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/repos/ink-todo
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +2 src/App.tsx
badd +10 src/root.tsx
badd +1 dist/root.js
badd +22 ~/repos/ink-todo/src/db/DB.ts
badd +1 src/hooks/tasks.ts
badd +1 ~/repos/ink-todo/src/hooks/useTasks.ts
badd +40 ~/repos/ink-todo/node_modules/ink-text-input/build/index.d.ts
badd +10 ~/repos/ink-todo/src/hooks/usePriority.ts
badd +27 package.json
badd +3 ~/repos/ink-todo/bin/root.mjs
badd +2486 ~/notes/nodejs/notes.txt
argglobal
%argdel
$argadd src/App.tsx
edit package.json
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
split
1wincmd k
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe '1resize ' . ((&lines * 41 + 27) / 54)
exe '2resize ' . ((&lines * 10 + 27) / 54)
argglobal
balt ~/repos/ink-todo/bin/root.mjs
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 1 - ((0 * winheight(0) + 20) / 41)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1
normal! 0
wincmd w
argglobal
if bufexists(fnamemodify("term://~/repos/ink-todo//148160:/bin/zsh;\#toggleterm\#1", ":p")) | buffer term://~/repos/ink-todo//148160:/bin/zsh;\#toggleterm\#1 | else | edit term://~/repos/ink-todo//148160:/bin/zsh;\#toggleterm\#1 | endif
if &buftype ==# 'terminal'
  silent file term://~/repos/ink-todo//148160:/bin/zsh;\#toggleterm\#1
endif
balt ~/notes/nodejs/notes.txt
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 79 - ((9 * winheight(0) + 5) / 10)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 79
normal! 022|
wincmd w
2wincmd w
exe '1resize ' . ((&lines * 41 + 27) / 54)
exe '2resize ' . ((&lines * 10 + 27) / 54)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
let g:this_session = v:this_session
let g:this_obsession = v:this_session
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
