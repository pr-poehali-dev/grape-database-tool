import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления виноградарями: получение, добавление, обновление и удаление
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('''
                    SELECT 
                        id, name, location, bush_count, type,
                        x_position, y_position, latitude, longitude,
                        cat, technical_varieties, table_varieties,
                        created_at, updated_at
                    FROM vineyards
                    ORDER BY created_at DESC
                ''')
                vineyards = cur.fetchall()
                
                result = []
                for v in vineyards:
                    result.append({
                        'id': v['id'],
                        'name': v['name'],
                        'location': v['location'],
                        'bushCount': v['bush_count'],
                        'type': v['type'],
                        'x': float(v['x_position']),
                        'y': float(v['y_position']),
                        'latitude': float(v['latitude']),
                        'longitude': float(v['longitude']),
                        'cat': v['cat'],
                        'technicalVarieties': v['technical_varieties'],
                        'tableVarieties': v['table_varieties']
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(result),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            with conn.cursor() as cur:
                cur.execute('''
                    INSERT INTO vineyards (
                        name, location, bush_count, type,
                        x_position, y_position, latitude, longitude,
                        cat, technical_varieties, table_varieties
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                ''', (
                    body_data['name'],
                    body_data['location'],
                    body_data['bushCount'],
                    body_data['type'],
                    body_data['x'],
                    body_data['y'],
                    body_data['latitude'],
                    body_data['longitude'],
                    body_data['cat'],
                    body_data['technicalVarieties'],
                    body_data['tableVarieties']
                ))
                new_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'id': new_id, 'message': 'Виноградарь добавлен'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            vineyard_id = params.get('id')
            
            if not vineyard_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'ID не указан'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor() as cur:
                cur.execute('DELETE FROM vineyards WHERE id = %s', (vineyard_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'message': 'Виноградарь удалён'}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()
