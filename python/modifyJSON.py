import json
""" Fetches JSON files from BC Transit Website and formats for PG Transit app

The JSON files come in the form of a .zip, once these are extracted place them in the same directory as modifyJSON.py

The run_script() method will open the routes.json file and run the getFilteredJSON method for each route.

Args:
    route_id: taken from the routes.json file for each route in Prince George

Returns:
    Does not actually return an argument, just dumps filtered JSON files for each route
"""

def getFilteredJSON(route_id):
    filtered_trips = []
    filtered_stop_times = []
    temp_filtered_stops = []
    filtered_stops_dict = {}
    filtered_stops_list = []
    result = []
    route_id = route_id

    with open('Resources/Trips.json') as trip_file:
        trips = json.load(trip_file)

    with open('Resources/Stop_times.json') as stop_times_file:
        stop_times = json.load(stop_times_file)

    with open('Resources/Stops.json') as stops_file:
        stops = json.load(stops_file)

    # Filter trips
    # When the route_id's match between files, we place that trip into filtered_trips
    for k in trips:
        if route_id == k['route_id']:
            filtered_trips.append(k)
            result.append(k)

    # Filter stops
    # When the trip_id's match between filtered_trips and stop_times we place the stop_times in filtered_stop_times
    for i in filtered_trips:
        for k in stop_times:
            if i['trip_id'] == k['trip_id']:
                filtered_stop_times.append(k)

    # Filter stop times
    # When the stop_id's match between filtered_stop_times and stops we place the stop in temp_filtered_stops
    for i in filtered_stop_times:
        for k in stops:
            if i['stop_id'] == k['stop_id']:
                temp_filtered_stops.append(k)

    # Remove duplicates from temp_filtered_stops
    # temp_filtered_stops has a "set" of stops for each stop time, this leads to a lot of repeats
    # Here we note when a stop is already seen, and only place it in filtered_stops_dict once
    for i in temp_filtered_stops:
        stop_id = i['stop_id']
        if stop_id not in filtered_stops_dict:
            filtered_stops_dict[stop_id] = i

    # Copy dictionary object to list for JSON dump
    # Cannot dump a dict cleanly to a json
    # Here we parse the dict and format to JSON for dumping
    for key, value in filtered_stops_dict.iteritems():
        temp = value
        filtered_stops_list.append(temp)

    # Dump all filtered data to individual JSON files
    with open('FilteredData/' + str(route_id) + 'Trips.json', 'w') as outfile:
        json.dump(filtered_trips, outfile, indent=4, ensure_ascii=False)

    with open('FilteredData/' + str(route_id) + 'StopTimes.json', 'w') as outfile:
        json.dump(filtered_stop_times, outfile, indent=4, ensure_ascii=False)

    with open('FilteredData/' + str(route_id) + 'Stops.json', 'w') as outfile:
        json.dump(filtered_stops_list, outfile, indent=4, ensure_ascii=False)

    # Print length data to console to ensure the above methods are working
    # The size between inputted data and filtered data should differ with the filtered data being smaller
    print "Data for: " + str(route_id)
    print "trips: " + str(len(trips))
    print "filtered trips: " + str(len(filtered_trips))
    print "stop times: " + str(len(stop_times))
    print "filtered stop times: " + str(len(filtered_stop_times))
    print "stops: " + str(len(stops))
    print "temp filtered stops: " + str(len(temp_filtered_stops))
    print "filtered stops: " + str(len(filtered_stops_dict))


# Opens Routes.json and runs getFilteredJSON for each route
def run_script():
    with open('Resources/Routes.json') as route_file:
        routes = json.load(route_file)

    for i in routes:
        route_id = i['route_id']
        getFilteredJSON(route_id)

run_script()
