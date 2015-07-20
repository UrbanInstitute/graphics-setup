ON STAGING SERVER

make proj_dir
make proj_dir/.git
cd proj_dir/.git && git init --bare
in hooks dir on staging server:
make post-receive
```
while read oldrev newrev refname
do
    branch=$(git rev-parse --symbolic --abbrev-ref $refname)
    GIT_WORK_TREE=/Users/bchartof/projects/fake-server/housing-burden-calculator git checkout $branch -f
done
```
(staging is now on whatever branch got pushed)

chmod +x hooks/post-receive

ON LOCAL
git remote set-url --add --push origin staging@path/to/proj_dir/.git
git remote set-url --add --push origin git@github.com:UrbanInstitute/housing-burden-calculator.git
git remote set-url --add --push origin prodpath


ON PROD

hook becomes
```
#!/bin/sh
while read oldrev newrev refname
do
    branch=$(git rev-parse --symbolic --abbrev-ref $refname)
    if [ "master" = "$branch" ]; then
        GIT_WORK_TREE=/Users/bchartof/projects/fake-server/housing-burden-calculator git checkout -f
    fi
done
```
(prod is always on master)