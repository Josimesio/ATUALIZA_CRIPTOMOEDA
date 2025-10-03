import requests
from operator import itemgetter

def get_top_gainers(n=10, vs_currency='usd'):
    """
    Retorna as n criptomoedas que mais valorizaram nas últimas 24h.
    vs_currency define em qual moeda você quer os preços (ex: 'usd').
    """
    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {
        'vs_currency': vs_currency,
        'order': 'market_cap_desc',
        'per_page': 250,       # busca até 250 criptos para filtrar
        'page': 1,
        'price_change_percentage': '24h',
        'sparkline': False
    }

    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()

    # filtra apenas as que tenham mudança no preço (muitos já vem com isso)
    # ordena por percentagem de aumento nas últimas 24h
    # (usar price_change_percentage_24h)
    # algumas APIs retornam esse campo como 'price_change_percentage_24h',
    # ou dentro de price_change_percentage chave
    gainers = [coin for coin in data if coin.get('price_change_percentage_24h') is not None]
    gainers_sorted = sorted(gainers, key=itemgetter('price_change_percentage_24h'), reverse=True)

    top = gainers_sorted[:n]
    resultado = []
    for coin in top:
        resultado.append({
            'nome': coin['name'],
            'símbolo': coin['symbol'],
            'preço_atual': coin['current_price'],
            'variação_24h_%': coin['price_change_percentage_24h']
        })

    return resultado

if __name__ == "__main__":
    top10 = get_top_gainers(10, vs_currency='usd')
    print("Top 10 criptomoedas que mais valorizaram nas últimas 24h:")
    for i, coin in enumerate(top10, start=1):
        print(f"{i}. {coin['nome']} ({coin['símbolo'].upper()}): {coin['variação_24h_%']:.2f}% — preço atual: ${coin['preço_atual']:.2f}")
