#include<bits/stdc++.h>
using namespace std;

int main()
{
    int n;
    cin>>n;

    vector<int> v;
    for (int i = 0; i < n; i++)
    {
        int x;
        cin>>x;
        v.push_back(x);
    }

    int mx = -1, mx1 = -1;
    vector<pair<int,int>> p, p1;
    int zero = 0, one = 0, zero1 = 0, one1 = 0;
    for (int i = 0; i < n; i++)
    {
        if(v[i] == 0)
        {
            zero+=1;
        }else{
            one+=1;
        }
        if(v[n-i-1]==0)
        {
            zero1++;
        }else if(v[n-i-1]==1)
        {
            one1++;
        }
        p.push_back({zero,one});
        p1.push_back({zero1,one1});
    }
    
    int index;
    for(int i = 0; i < p.size(); i++)
    {
        if(p[i].first == p[i].second)
        {
            mx = max(mx,p[i].first);
        }
        if(p1[i].first == p1[i].second)
        {
            mx1 = max(mx1,p1[i].first);
        }
    }
    cout<<max(mx*2,mx1*2)<<endl;
    return 0;
}