describe('controllers', function () {
    var scope, controller, $httpBackend;

    beforeEach(module('myApp'));
    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('NavbarController', function () {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('NavbarController', {
                '$scope': scope
            });
        }));

        it('should be defined', inject(function ($controller) {
            expect(controller).toBeDefined();
        }));

        it('should hold application version', inject(function ($controller) {
            $httpBackend.whenGET('/rest/admin/application-version').respond(200, {version: 'x.y.z'});

            $httpBackend.flush();

            expect(scope.version).toBe('vx.y.z');
        }));

        it('should show nothing on missing application version', inject(function ($controller) {
            $httpBackend.whenGET('/rest/admin/application-version').respond(200, {});

            $httpBackend.flush();

            expect(scope.version).toBe('');
        }));

        it('should show nothing on error retrieving application version', inject(function ($controller) {
            $httpBackend.whenGET('/rest/admin/application-version').respond(500);

            $httpBackend.flush();

            expect(scope.version).toBe('');
        }));

    });

});
